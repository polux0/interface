import { BigNumber } from "ethers";

export default function isGreaterThanOrEqualTo(amount1: any, amount2: any){
    return BigNumber.from(amount1? amount1 : 0).gte(BigNumber.from(amount2? amount2: 0));
}