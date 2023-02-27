// technical debt -> move all styling modules ( modules.css ) from /exchange components to single module
import exchangeFrom from '@/styles/exchange/ExchangeFrom.module.css'
import exchangeStyles from "@/styles/exchange/Exchange.module.css"
import exchangeTo from '@/styles/exchange/ExchangeTo.module.css'
import exchangeButton from "@/styles/exchange/ExchangeButton.module.css"
import ExchangeButton from './exchangebutton'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from "react";
import { ethers } from 'ethers';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useProvider, useWaitForTransaction } from 'wagmi'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { agencyStableAbi, agencyUsdcAmmRouterAbi, agencyTreasurySeedAbi } from '../../contracts/abis'
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
    // const [ currentAllowanceIncreased, setCurrentAllowanceIncreased] = useState(false);

    const debouncedInputAmount = useDebounce(amount, 800);
    const debouncedDeadline = useDebounce(deadline, 800);

    // technical debt 
    // user should set it's `deadline` as well as `slippage`
    const defaultDeadline = 7200000;

    let currentAllowanceNormalized;
    let amountWeiNormalized;
    let amountMinOutWeiValue;
    try {
         currentAllowanceNormalized = ethers.utils.parseUnits(currentAllowance.toString(), "ether").toString();
         amountWeiNormalized = ethers.utils.parseUnits(amountWei.toString(), "ether").toString();
         amountMinOutWeiValue = BigNumber.from(amountWei).sub(BigNumber.from(amountWei).div(10));
    } catch (error) {
        currentAllowanceNormalized = "0";
        amountWeiNormalized = "0";
        amountMinOutWeiValue = BigNumber.from("0");

    }
    // technical debt - move all of those functions to separate module
    // 🤖 deployer address 0xD3d5B16a5B25AafffC9A9459Af4de2a38bc8d659
    // 🎥 agency deployed at 0x40B2911A8f9ff3B5a806e79DA7F9445ff3970362
    // 🎥 agency stable deployed at 0xD7295ab92c0BAe514dC33aB9Dd142f7d10AC413b
    // 🎥 agency treasury deployed at 0x5c41C8AF1C022ECadf1C309F8CCA489A93077a8b
    // 🎥 agency treasury seed deployed at 0xb08a51B76A5c00827336903598Dce825912bDeCc

    // fetch alowance ( treasurySeedContract.address <> account.address )( done )
    const { refetch: fetchAllowance } = useContractRead({
        address: '0xD7295ab92c0BAe514dC33aB9Dd142f7d10AC413b',
        abi: agencyStableAbi,
        functionName: 'allowance',
        args:[account.address, "0xb08a51B76A5c00827336903598Dce825912bDeCc"],
        enabled: false,
    })
    // fetch quote ( done )
    const { refetch: fetchQuote } = useContractRead({
        address: '0xb08a51B76A5c00827336903598Dce825912bDeCc',
        abi: agencyTreasurySeedAbi,
        functionName: 'getSeedQuote',
        args:[amountWei],
        enabled: false,
    })
    // increase allowance ( account.address <> treasurySeedContract.address ) ( done )
    const { config: increaseAllowanceConfig } = usePrepareContractWrite({
        address: '0xD7295ab92c0BAe514dC33aB9Dd142f7d10AC413b',
        abi: agencyStableAbi,
        functionName: 'increaseAllowance',
        args: ["0x5c41C8AF1C022ECadf1C309F8CCA489A93077a8b", amountWeiNormalized],
    })
    // treasurySeed ( done )
    const { config: swapExactFraxForTempleConfig } = usePrepareContractWrite({
        address: '0xb08a51B76A5c00827336903598Dce825912bDeCc',
        abi: agencyTreasurySeedAbi,
        functionName: 'seed',
        args: [amountWeiNormalized],
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
        // question: should we put `currentAllowanceNormalized` && `amountNormalized` as part of state
        let currentAllowanceNormalized;
        try {
            currentAllowanceNormalized = BigNumber.from(currentAllowance).toString();    
        } catch (error) {
            currentAllowanceNormalized = "0";
        }
        
        const amountNormalized = ethers.utils.parseEther(amount).toString()
        const isCurrentAllowanceGreaterOrEqualToAmount = (BigNumber.from(currentAllowanceNormalized)).gte(BigNumber.from(amountNormalized));
        return isCurrentAllowanceGreaterOrEqualToAmount ? "Swap" : "Increase allowance";
    }
    useWaitForTransaction({
        confirmations: 1,
        hash: increaseAllowanceData?.hash,
        onSettled(data, error) {
            console.log('Settled', { data, error })
            fetchAllowance?.().then(increaseAllowancePromise =>{
                const updatedAllowance = increaseAllowancePromise?.data as string
                setCurrentAllowance(updatedAllowance);
            })
          },
      });

    const increaseAllowanceOrSwapWrite = function(){

        const result = increaseAllowanceOrSwap()
        result === "Swap" ? swapExactFraxForTempleWrite?.() : increaseAllowanceWrite?.();
    }
    useEffect(
        () => {
          if (debouncedInputAmount) {
            fetchAllowance?.().then(currentAllowancePromise =>{
                const result = currentAllowancePromise?.data as string
                setCurrentAllowance(result);
            })
            fetchQuote?.().then(quote => {
                const result = quote?.data as any;
                let amountOutAMM, amountOutProtocol, amountOut;
                const test = ethers.utils.formatUnits( result, "wei" ) || 0
                try {
                    amountOut = ethers.utils.formatUnits( result, "wei" );
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
