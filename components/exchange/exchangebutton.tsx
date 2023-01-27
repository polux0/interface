import { agencyStableAbi, agencyUsdcAmmRouterAbi } from "@/contracts/abis";
import exchangeButton from "@/styles/exchange/ExchangeButton.module.css"
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction, useAccount, useProvider} from "wagmi"
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import useDebounce from '../../hooks/Debounce';



export default function ExchangeButton({...props}){
    const [deadline, setDeadline] = useState(0);
    const {amountWei, currentAllowance} = props;
    console.log('amountWei:', amountWei)
    // technical debt
    const amountWeiNormalized = ethers.utils.parseUnits(amountWei.toString(), "ether").toString();
    console.log('amountWeiNormalized:', amountWeiNormalized)

    const debouncedDeadline = useDebounce(deadline, 800);

    // technical debt 
    // user should set it's deadline
    const defaultDeadline = 7200000;
    // default slippage
    const amountMinOutWeiValue = BigNumber.from(amountWei).sub(BigNumber.from(amountWei).div(10));

    const account = useAccount();
    console.log('account: ', account)
    const provider = useProvider();

    const addRecentTransaction = useAddRecentTransaction();

    // technical debt
    // const prepareContractWrite = (functionName: string) => {
    //     // getContractConfigBasedOnFunctionName()

    // }
    const { config: increaseAllowanceConfig } = usePrepareContractWrite({
        address: '0x97f35E291f65711CC8f48F9f92748FE17C5AF1Da',
        abi: agencyStableAbi,
        functionName: 'increaseAllowance',
        args: ["0x3a6315B9BFeCF72e39f8327DA6cCBf93473608B8", amountWei.toString()],
    })

    const { config: swapExactFraxForTempleConfig } = usePrepareContractWrite({
        address: '0x4d0E552aAc0370b68A23B5b00bd96f8e3FF556C5',
        abi: agencyUsdcAmmRouterAbi,
        functionName: 'swapExactFraxForTemple',
        args: [amountWei, amountMinOutWeiValue, account.address, debouncedDeadline],
        // not sure if necessary
        overrides: {gasLimit: BigNumber.from(600000)}
    })

    useEffect(() => {
        const currentBlockNumber = provider.getBlockNumber().then(currentBlockNumber => { return currentBlockNumber });
        provider.getBlock(currentBlockNumber).then(currentBlock => setDeadline(currentBlock.timestamp + defaultDeadline));
        return () => {
            setDeadline(0);
        };
    }, [setDeadline, provider]);

    // console.log('block.timestamp fetched: ', deadline)
    // let swapTx = await contract.swapExactFraxForTemple(amountInWeiValue, amountMinOutWeiValue, account, deadline, {gasLimit: 600000});

    const { write: increaseAllowanceWrite, data: increaseAllowanceData, error: increaseAllowanceError, isLoading: increaseAllowanceIsLoading, isError: increaseAllowanceIsError, isSuccess: increaseAllowanceIsSuccess } = useContractWrite(increaseAllowanceConfig)
    const { write: swapExactFraxForTempleWrite, data: swapExactFraxForTempleWriteData, error: swapExactFraxForTempleWriteError, isLoading: swapExactFraxForTempleWriteIsLoading, isError: swapExactFraxForTempleWriteIsError, isSuccess: swapExactFraxForTempleWriteIsSuccess } = useContractWrite(swapExactFraxForTempleConfig)

    if(increaseAllowanceError){
        console.log('Error with `usePrepareContractWriteIncreaseAllowance`: ', increaseAllowanceError)
    }
    if(swapExactFraxForTempleWriteError){
        console.log('Error with `usePrepareContractWriteswapExactFraxForTempleWrite`: ', swapExactFraxForTempleWriteError)
    }
    // Technical debt
    // Think how this should be applied
    // useWaitForTransaction({
    // hash: data?.hash,
    // onSuccess(){
    //     console.log('data?.hash: ', data?.hash)
    //     addRecentTransaction({
    //         hash: data?.hash.toString() || "",
    //         description:"increase allowance"
    //     })
    // }
    // })
    // technical debt - once transaction is finished we should rerender the component
    const increaseAllowanceOrSwap = function(){
        return amountWei <= currentAllowance ? "Swap" : "Increase allowance";
    }
    const increaseAllowanceOrSwapWrite = function(){

        const result = increaseAllowanceOrSwap()
        result === "Swap" ? swapExactFraxForTempleWrite?.() : increaseAllowanceWrite?.();
    }
    return(
        <div>
            <button onClick={increaseAllowanceOrSwapWrite}className={exchangeButton.button}>{increaseAllowanceOrSwap()}</button>
        </div>
    )
}