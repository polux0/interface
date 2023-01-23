import exchangeFrom from '@/styles/exchange/ExchangeFrom.module.css'
import { useState } from 'react';
import { ethers } from 'ethers';
import useDebounce from '../../hooks/Debounce';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction, useWatchPendingTransactions } from 'wagmi'
import { agencyStableAbi } from '../../contracts/abis'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';


export default function ExchangeFrom(){
    const [amountSet, setAmount] = useState("1");
    const account = useAccount();
    const addRecentTransaction = useAddRecentTransaction();

    const { refetch } = useContractRead({
        address: '0x97f35E291f65711CC8f48F9f92748FE17C5AF1Da',
        abi: agencyStableAbi,
        functionName: 'allowance',
        args:[account.address, "0x3a6315B9BFeCF72e39f8327DA6cCBf93473608B8"],
        enabled: false,
    })

    const { config, error } = usePrepareContractWrite({
        address: '0x97f35E291f65711CC8f48F9f92748FE17C5AF1Da',
        abi: agencyStableAbi,
        functionName: 'increaseAllowance',
        args: ["0x3a6315B9BFeCF72e39f8327DA6cCBf93473608B8", amountSet.toString()],
    })

    const { data, isSuccess, write } = useContractWrite({...config, 
        onSuccess(data) {
        console.log('useContractWrite data: ', data)
      },})

    useWatchPendingTransactions({
    listener: (transaction) => {
        console.log('transaction?.hash'),
        addRecentTransaction({
            // hash: "https://goerli.etherscan.io/tx/" + transaction?.hash,
            hash: transaction?.hash || "",
            description:"increase allowance"
        })
    }
    })
    
    useWaitForTransaction({
    hash: data?.hash,
    onSuccess(){
        console.log('data?.hash: ', data?.hash)
        addRecentTransaction({
            // hash: "https://goerli.etherscan.io/tx/" + data?.hash,
            hash: data?.hash.toString() || "",
            description:"increase allowance"
        })
    }
    })
    
    if(error){
        console.log('Error with `usePrepareContractWrite`: ', error)
    }
    return(
        <div className ={exchangeFrom.main}>
        <input className = {exchangeFrom.label} type="number" min="1" name="exchangefrom" value={amountSet} onChange={async e => await handler(e)} />
        </div>
    )
    async function handler(event: any){
        const amount: any = event.target.value;
        const amountWeiValue = ethers.utils.formatUnits(amount, "wei");
        setAmount(amountWeiValue);
        console.log('exchangeFrom input amount: ', amountSet);
        allowance()
    }
    async function allowance(){
        const response = await refetch?.()
        const allowance :any = response.data

        console.log('amount: ', amountSet)
        console.log('allowance: ', allowance.toString())
        if(amountSet > allowance.toString()) {
            console.log('we need to increase allowance')
            write?.()
        }
    }


}