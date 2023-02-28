import { BigNumber } from "ethers";

export default function enoughStables(balance: any, desiredAmount: any){
    return BigNumber.from(balance? balance : 0).gte(BigNumber.from(desiredAmount? desiredAmount: 0));
}