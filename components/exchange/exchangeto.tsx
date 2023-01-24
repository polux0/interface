import { agencyUsdcAmmRouterAbi } from '@/contracts/abis';
import exchangeTo from '@/styles/exchange/ExchangeTo.module.css'
import { ethers } from 'ethers';
import { useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';

export default function ExchangeTo(){
    
    const [expectedAmout, setExpectedAmount] = useState("1");
    const account = useAccount();
    // decide how will we receive this here
    const amount = 10;
    const amountWeiValue = ethers.utils.formatUnits(amount, "wei") || "0";

    const { refetch } = useContractRead({
        address: '0x3a6315B9BFeCF72e39f8327DA6cCBf93473608B8',
        abi: agencyUsdcAmmRouterAbi,
        functionName: 'swapExactFraxForTempleQuote',
        args:[amountWeiValue],
        enabled: false,
    })
    
    async function getQuote(amount: string){

        const quoteResponse: any = await refetch?.()
        console.log('quoteResponse: ', quoteResponse)

        const amountOutAMM = quoteResponse[2];
        const amountOutProtocol = quoteResponse[3];
        setExpectedAmount(amountOutAMM+amountOutProtocol)
    }

    return(
        <div className={exchangeTo.main}>
        <input className = {exchangeTo.label} value={expectedAmout} onChange={()=>{}}type="number" name="exchangeto" />
        </div>
    )
}