import { agencyStableAbi } from "@/contracts/abis";
import exchangeButton from "@/styles/exchange/ExchangeButton.module.css"
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi"
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';


export default function ExchangeButton(){
    const addRecentTransaction = useAddRecentTransaction();
    // amountSet will be passed as a part of props
    const amountSet = 1;

    const increaseAllowanceConfig = {
        address: '0x97f35E291f65711CC8f48F9f92748FE17C5AF1Da',
        abi: agencyStableAbi,
        functionName: 'increaseAllowance',
        args: ["0x3a6315B9BFeCF72e39f8327DA6cCBf93473608B8", amountSet.toString()],
    }
    const swapExactFraxForTempleQuote = {
        address: '0x97f35E291f65711CC8f48F9f92748FE17C5AF1Da',
        abi: agencyStableAbi,
        functionName: 'increaseAllowance',
        args: ["0x3a6315B9BFeCF72e39f8327DA6cCBf93473608B8", amountSet.toString()]
    }

    const { config, error } = usePrepareContractWrite({...increaseAllowanceConfig})

    if(error){
        console.log('Error with `usePrepareContractWrite`: ', error)
    }

    const { data, isSuccess, write } = useContractWrite({...config, 
        onSuccess(data) {
        console.log('useContractWrite data: ', data)
    },})

    // technical debt
    // usePrepareContractWrite for `swap`
    
    useWaitForTransaction({
    hash: data?.hash,
    onSuccess(){
        console.log('data?.hash: ', data?.hash)
        addRecentTransaction({
            hash: data?.hash.toString() || "",
            description:"increase allowance"
        })
    }
    })
    // async function increaseAllowanceOrSwap(amount: any, currentAllowance: any){
    //     if(amount > currentAllowance) {
    //         console.log('we need to increase allowance')
    //         write?.()
    //     }
    //     else
    // }
    return(
        <div>
            <button className={exchangeButton.button}>Swap</button>
        </div>
    )
}