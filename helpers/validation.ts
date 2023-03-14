import { BigNumber, ethers } from "ethers";

const validation = {
    isAmountEntered,
    isEnoughAllowance,
    isEnoughStables
}
function isGreaterThanOrEqualTo(amount1: any, amount2: any){
    return BigNumber.from(amount1? amount1 : 0).gte(BigNumber.from(amount2? amount2: 0));
}
function isGreaterThan(amount1: any, amount2: any){
    return BigNumber.from(amount1? amount1 : 0).gt(BigNumber.from(amount2? amount2: 0));
}
function isAmountEntered(amount: any){
    return isGreaterThan(amount, 0) 
}
function isEnoughAllowance(amount: string, allowance: string){
    const amountWei = ethers.utils.parseEther(amount).toString() ?? "0"
    return isGreaterThanOrEqualTo(allowance, amountWei);
}
function isEnoughStables(amount: string, allowance: string){
    return isGreaterThanOrEqualTo(amount, allowance);
}
export default {isAmountEntered, isEnoughAllowance, isEnoughStables};