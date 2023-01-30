import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import {  useState } from "react";

export default function ExchangeButton({...props}){
    const [deadline, setDeadline] = useState(0);
    const {amountWei, currentAllowance} = props;
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
    return(
        <div>
            {/* <button onClick={increaseAllowanceOrSwapWrite}className={exchangeButton.button}>{increaseAllowanceOrSwap()}</button> */}
        </div>
    )
}