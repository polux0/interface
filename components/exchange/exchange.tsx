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


export default function Exchange({...props}){
    // technical debt
    // 1. use debounce
    // 2. create config for contracts ( hooks )
    const account = useAccount();
    
    const [ amount, setAmount ] = useState("");
    const [ amountWei, setAmountWei ] = useState("");
    const [ currentAllowance, setCurrentAllowance ] = useState("");
    const [ expectedAmount, setExpectedAmount ] = useState("");
    const [ isEnteringAmount, setIsEnteringAmount ] = useState<boolean>(false);

    // Debounce search term so that it only gives us latest value ...
    // ... if searchTerm has not been updated within last 500ms
    // As a result the API call should only fire once user stops typing
    // const debouncedInputAmount = useDebounce(amountHandler, 500);
    // useDebounce(amountHandler, 500);

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
    async function amountHandler(event: any){
        const amount: any = event.target.value;
        let amountWei = "";
        try {
            amountWei = ethers.utils.formatUnits(amount, "wei");    
        } catch (error) {
            amountWei = "0";
        }
        setAmountWei(amountWei)
        setAmount(amountWei);
        const currentAllowance: any = (await fetchAllowance?.()).data
        setCurrentAllowance(currentAllowance);
        // await getQuote(amountWei);
    }
    async function getQuote(amount: string){
        const quoteResponse: any = await fetchQuote?.()
        const amountOutAMM = quoteResponse.data[2];
        const amountOutProtocol = quoteResponse.data[3];
        setExpectedAmount(amountOutAMM+amountOutProtocol)
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
            <input className = {exchangeFrom.label} type="number" name="exchangefrom" value={amount} onChange={ e => amountHandler(e)} />
            </div>
            {/* </ExchangeFrom> */}
            {/* <ExchangeTo> */}
            <div className={exchangeTo.main}>
            <input className = {exchangeTo.label} defaultValue={expectedAmount} type="number" name="exchangeto" />
            </div>
            {/* </ExchangeTo> */}   
            <ConnectButton></ConnectButton>
            <ExchangeButton></ExchangeButton> 
            {/* {isWalletConnected(walletConnected)} */}
        </div>
    )
}
function isWalletConnected(connected: boolean){
    return connected ? <ExchangeButton></ExchangeButton> : <ConnectButton></ConnectButton>
}