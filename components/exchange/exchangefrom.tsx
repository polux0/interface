import exchangeFrom from '@/styles/exchange/ExchangeFrom.module.css'
import { useState } from 'react';
import { ethers } from 'ethers';
import useDebounce from '../../hooks/Debounce';
import { useAccount, useContractRead } from 'wagmi'
import { agencyStableAbi } from '../../contracts/abis'

export default function ExchangeFrom({...props}){
    // technical debt
    // use debounce
    const { setDesiredAmount, setCurrentAllowance } = props;
    const [ amountSet, setAmount ] = useState("1");
    const account = useAccount();

    const { refetch } = useContractRead({
        address: '0x97f35E291f65711CC8f48F9f92748FE17C5AF1Da',
        abi: agencyStableAbi,
        functionName: 'allowance',
        args:[account.address, "0x4d0E552aAc0370b68A23B5b00bd96f8e3FF556C5"],
        enabled: false,
    })
    return(
        <div className ={exchangeFrom.main}>
        <input className = {exchangeFrom.label} type="number" min="1" name="exchangefrom" value={amountSet} onChange={async e => await handler(e)} />
        {/* <input className = {exchangeFrom.label} type="number" min="1" name="exchangefrom" value={amountSet} onChange={useDebounce((e: any) => {
            handler(e)}, 2000)} /> */}
        </div>
    )
    async function handler(event: any){
        const amount: any = event.target.value;
        let amountWeiValue = "";
        try {
            amountWeiValue = ethers.utils.formatUnits(amount, "wei");    
        } catch (error) {
            amountWeiValue = "0";
        }
        setAmount(amountWeiValue);
        // console.log('exchangeFrom input amount: ', amountSet);
        const currentAllowance = allowance()
    }
    async function allowance(){
        const response = await refetch?.()
        return response.data
    }


}