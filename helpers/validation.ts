import { BigNumber } from "ethers";

const validation = {
    isGreaterThan,
    isGreaterThanOrEqualTo
}
function isGreaterThanOrEqualTo(amount1: any, amount2: any){
    return BigNumber.from(amount1? amount1 : 0).gte(BigNumber.from(amount2? amount2: 0));
}
function isGreaterThan(amount1: any, amount2: any){
    return BigNumber.from(amount1? amount1 : 0).gt(BigNumber.from(amount2? amount2: 0));
}
export default validation;