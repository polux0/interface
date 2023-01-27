// technical debt -> move all styling modules ( modules.css ) from /exchange components to single module
import exchangeFrom from '@/styles/exchange/ExchangeFrom.module.css'
import exchangeStyles from "@/styles/exchange/Exchange.module.css"
import exchangeTo from '@/styles/exchange/ExchangeTo.module.css'
import ExchangeButton from './exchangebutton'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from "react";
import { ethers } from 'ethers';
import { useAccount, useContractRead } from 'wagmi'
import { agencyStableAbi, agencyUsdcAmmRouterAbi } from '../../contracts/abis'
import useDebounce from '../../hooks/Debounce';
import { BigNumber } from 'ethers';


export default function Exchange({...props}){
    // technical debt
    // 2. create config for contracts ( hooks )
    const account = useAccount();
    
    const [ amount, setAmount ] = useState("0");
    const [ amountWei, setAmountWei ] = useState("0");
    const [ currentAllowance, setCurrentAllowance ] = useState("0");
    const [ expectedAmount, setExpectedAmount ] = useState("0");

    const debouncedInputAmount = useDebounce(amount, 800);

    // fetch allowance
    const { refetch: fetchAllowance } = useContractRead({
        address: '0x97f35E291f65711CC8f48F9f92748FE17C5AF1Da',
        abi: agencyStableAbi,
        functionName: 'allowance',
        args:[account.address, "0x3a6315B9BFeCF72e39f8327DA6cCBf93473608B8"],
        enabled: false,
    })
    // fetch quote
    const { refetch: fetchQuote } = useContractRead({
        address: '0x3a6315B9BFeCF72e39f8327DA6cCBf93473608B8',
        abi: agencyUsdcAmmRouterAbi,
        functionName: 'swapExactFraxForTempleQuote',
        args:[amountWei],
        enabled: false,
    })
    useEffect(
        () => {
          if (debouncedInputAmount) {
            fetchAllowance?.().then(currentAllowancePromise =>{
                const result = currentAllowancePromise?.data as string
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
          } else {
            setCurrentAllowance("0");
            setExpectedAmount("0")
          }
        },
        [debouncedInputAmount, fetchAllowance, fetchQuote] // Only call effect if debounced search term changes
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
            <ExchangeButton amountWei = {amountWei} currentAllowance={currentAllowance}></ExchangeButton> 
            {/* {isWalletConnected(walletConnected)} */}
        </div>
    )
}
function isWalletConnected(connected: boolean){
    return connected ? <ExchangeButton></ExchangeButton> : <ConnectButton></ConnectButton>
}