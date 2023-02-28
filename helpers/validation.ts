import { BigNumber } from "ethers";

export default function enoughStables(balance: any, desiredAmount: any){
    console.log("balance: ", balance)
    console.log("desired amount: ", desiredAmount)
    console.log("balance > desiredAmount: ", balance > desiredAmount)
    return BigNumber.from(balance).gte(BigNumber.from(desiredAmount));
}