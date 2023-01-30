// technical debt -> move all styling modules ( modules.css ) from /exchange components to single module
import exchangeFrom from '@/styles/exchange/ExchangeFrom.module.css'
import exchangeStyles from "@/styles/exchange/Exchange.module.css"
import exchangeTo from '@/styles/exchange/ExchangeTo.module.css'
import exchangeButton from "@/styles/exchange/ExchangeButton.module.css"
import ExchangeButton from './exchangebutton'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from "react";
import { ethers } from 'ethers';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useProvider } from 'wagmi'
import { agencyStableAbi, agencyUsdcAmmRouterAbi } from '../../contracts/abis'
import useDebounce from '../../hooks/Debounce';
import { BigNumber } from 'ethers';


export default function Exchange({...props}){
    // technical debt
    // 2. create config for contracts ( hooks )
    const account = useAccount();
    const provider = useProvider();

    
    const [ amount, setAmount ] = useState("0");
    const [ amountWei, setAmountWei ] = useState("0");
    const [ currentAllowance, setCurrentAllowance ] = useState("0");
    const [ expectedAmount, setExpectedAmount ] = useState("0");
    const [ deadline, setDeadline ] = useState(0);

    const debouncedInputAmount = useDebounce(amount, 800);
    const debouncedDeadline = useDebounce(deadline, 800);

    // technical debt 
    // user should set it's `deadline` as well as `slippage`
    const defaultDeadline = 7200000;

    const currentAllowanceNormalized = ethers.utils.parseUnits(currentAllowance.toString(), "ether").toString();
    const amountWeiNormalized = ethers.utils.parseUnits(amountWei.toString(), "ether").toString();
    const amountMinOutWeiValue = BigNumber.from(amountWei).sub(BigNumber.from(amountWei).div(10));

    // technical debt - move all of those functions to separate module
    // 🎥 agency stable deployed at 0x531734989A71f78054450BbfEB3C70BA3BffEf2c
    // 🎥 agency usdc amm router deployed at 0x4d0E552aAc0370b68A23B5b00bd96f8e3FF556C5
    // fetch allowance
    const { refetch: fetchAllowance } = useContractRead({
        address: '0x531734989A71f78054450BbfEB3C70BA3BffEf2c',
        abi: agencyStableAbi,
        functionName: 'allowance',
        args:[account.address, "0x4d0E552aAc0370b68A23B5b00bd96f8e3FF556C5"],
        enabled: false,
    })
    // fetch quote
    const { refetch: fetchQuote } = useContractRead({
        address: '0x4d0E552aAc0370b68A23B5b00bd96f8e3FF556C5',
        abi: agencyUsdcAmmRouterAbi,
        functionName: 'swapExactFraxForTempleQuote',
        args:[amountWei],
        enabled: false,
    })
    // increase allowance
    const { config: increaseAllowanceConfig } = usePrepareContractWrite({
        address: '0x531734989A71f78054450BbfEB3C70BA3BffEf2c',
        abi: agencyStableAbi,
        functionName: 'increaseAllowance',
        args: ["0x4d0E552aAc0370b68A23B5b00bd96f8e3FF556C5", amountWeiNormalized],
    })
    // swapExactFraxForTemple
    const { config: swapExactFraxForTempleConfig } = usePrepareContractWrite({
        address: '0x4d0E552aAc0370b68A23B5b00bd96f8e3FF556C5',
        abi: agencyUsdcAmmRouterAbi,
        functionName: 'swapExactFraxForTemple',
        args: [amountWeiNormalized, amountMinOutWeiValue, account.address, debouncedDeadline],
        // not sure if necessary
        overrides: {gasLimit: BigNumber.from(600000)}
    })
    // config of contractWrite 
    const { write: increaseAllowanceWrite, data: increaseAllowanceData, error: increaseAllowanceError, isLoading: increaseAllowanceIsLoading, isError: increaseAllowanceIsError, isSuccess: increaseAllowanceIsSuccess } = useContractWrite(increaseAllowanceConfig)
    const { write: swapExactFraxForTempleWrite, data: swapExactFraxForTempleWriteData, error: swapExactFraxForTempleWriteError, isLoading: swapExactFraxForTempleWriteIsLoading, isError: swapExactFraxForTempleWriteIsError, isSuccess: swapExactFraxForTempleWriteIsSuccess } = useContractWrite(swapExactFraxForTempleConfig)

    if(increaseAllowanceError){
        console.log('Error with `usePrepareContractWriteIncreaseAllowance`: ', increaseAllowanceError)
    }
    if(swapExactFraxForTempleWriteError){
        console.log('Error with `usePrepareContractWriteswapExactFraxForTempleWrite`: ', swapExactFraxForTempleWriteError)
    }
    const increaseAllowanceOrSwap = function(){
        // technical debt
        // question should we put `currentAllowanceNormalized` && `amountNormalized` as part of state
        const currentAllowanceNormalized = BigNumber.from(currentAllowance).toString();
        const amountNormalized = ethers.utils.parseEther(amount).toString()
        const isCurrentAllowanceBiggerOrEqualToAmount = (BigNumber.from(currentAllowanceNormalized)).gte(BigNumber.from(amountNormalized));
        return isCurrentAllowanceBiggerOrEqualToAmount ? "Swap" : "Increase allowance";
    }
    const increaseAllowance = function (){
        increaseAllowanceWrite?.();
        
        // after we set allowance, increase current allowance to new value! and button will rerender itself
    }
    const increaseAllowanceOrSwapWrite = function(){

        const result = increaseAllowanceOrSwap()
        result === "Swap" ? swapExactFraxForTempleWrite?.() : increaseAllowance();
    }
    useEffect(
        () => {
          if (debouncedInputAmount) {
            fetchAllowance?.().then(currentAllowancePromise =>{
                const result = currentAllowancePromise?.data as string
                console.log("amount: ", amountWei)
                setCurrentAllowance(result);
            })
            fetchQuote?.().then(quote => {
                const result = quote?.data as Array<any>;
                let amountOutAMM, amountOutProtocol, amountOut;
                try {
                    amountOutAMM = BigNumber.from(result?.[2])
                    amountOutProtocol = BigNumber.from(result[3])
                    amountOut = amountOutAMM.add(amountOutProtocol);

                } catch (error) {
                    amountOutAMM = 0
                    amountOutProtocol = 0
                    amountOut = 0
                }
                setExpectedAmount(amountOut.toString())
            });
            const currentBlockNumber = provider.getBlockNumber().then(currentBlockNumber => { return currentBlockNumber });
            provider.getBlock(currentBlockNumber).then(currentBlock => setDeadline(currentBlock.timestamp + defaultDeadline));
          } else {
            setCurrentAllowance("0");
            setExpectedAmount("0")
            setDeadline(0);
          }
        },
        [debouncedInputAmount, fetchAllowance, fetchQuote, setDeadline, provider] // Only call effect if debounced search term changes
    );
    async function amountHandler(event: any){
        const amount: any = event.target.value;
        let amountWei;
        try {
            amountWei = ethers.utils.formatUnits(amount, "wei");    
        } catch (error) {
            amountWei = "0";
        }
        setAmountWei(amountWei)
        // technical debt
        // should not be here as it violates single responsibillity principle
        setAmount(amountWei);
    }
    // was before
    // return (
    //     <div className={exchangeStyles.main}>
    //         <ExchangeFrom></ExchangeFrom>
    //         <ExchangeTo></ExchangeTo>
    //         <ConnectButton></ConnectButton>
    //         <ExchangeButton></ExchangeButton> 
    //         {/* {isWalletConnected(walletConnected)} */}
    //     </div>
    // )

    // experimenting
    return (
        <div className={exchangeStyles.main}>
            {/* <ExchangeFrom> */}
            <div className ={exchangeFrom.main}>
            <input className = {exchangeFrom.label} type="number" name="exchangefrom" min="0" value={amount} onChange={ e => amountHandler(e)} />
            </div>
            {/* </ExchangeFrom> */}
            {/* <ExchangeTo> */}
            <div className={exchangeTo.main}>
            <input className = {exchangeTo.label} defaultValue={expectedAmount} type="number" min="0" name="exchangeto" />
            </div>
            {/* </ExchangeTo> */}   
            <ConnectButton></ConnectButton>
            {/* here we pass wei value */}
            {/* ExchangeButton */}
            <button onClick={increaseAllowanceOrSwapWrite} className={exchangeButton.button} >{increaseAllowanceOrSwap()}</button>
            {/* <ExchangeButton amountWei = {amountWei} currentAllowance={currentAllowance}></ExchangeButton>  */}
            {/* {isWalletConnected(walletConnected)} */}
        </div>
    )
}
function isWalletConnected(connected: boolean){
    return connected ? <ExchangeButton></ExchangeButton> : <ConnectButton></ConnectButton>
}