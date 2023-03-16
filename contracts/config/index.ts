import { BigNumber } from "ethers";
import { useContractRead, usePrepareContractWrite } from "wagmi";
import { agencyStableAbi, agencyTreasurySeedAbi } from "../abis";

// technical debt - move all of those functions to separate module
// 🤖 deployer address 0xD3d5B16a5B25AafffC9A9459Af4de2a38bc8d659
// 🎥 agency deployed at 0x40B2911A8f9ff3B5a806e79DA7F9445ff3970362
// 🎥 agency stable deployed at 0xD7295ab92c0BAe514dC33aB9Dd142f7d10AC413b
// 🎥 agency treasury deployed at 0x5c41C8AF1C022ECadf1C309F8CCA489A93077a8b
// 🎥 agency treasury seed deployed at 0xb08a51B76A5c00827336903598Dce825912bDeCc

// READ FUNCTIONS //

// fetch alowance ( general )
// current usages:
// 1.  How many stables can `treasury seed` contract pull from owner
export function prepareFetchAllowance(contractAddress: any, abi: any, owner: string, spender: string){
    const { refetch: fetchAllowance } = useContractRead({
        address: contractAddress,
        // getAbi(address: string)? requires to create map <address, abi>
        abi: agencyStableAbi,
        functionName: 'allowance',
        args: [owner, spender],
        enabled: false,
    })
    return fetchAllowance;
}
// treasury seed specific
export function prepareFetchQuote(contractAddress: any, abi: any, amountWei: string){
    const { refetch: fetchQuote } = useContractRead({
        address: contractAddress,
        abi: agencyTreasurySeedAbi,
        functionName: 'getSeedQuote',
        args: [amountWei],
        enabled: false,
    })
    return fetchQuote;
}
// WRITE FUNCTIONS //

// increase allowance ( general )
// current usages:
// 1. Increase amount of stables that 
export function prepareIncreaseAllowanceWrite(contractAddress: any, abi: any, owner: string, spender: string, amountWei: string){
 // increase allowance ( account.address <> treasurySeedContract.address ) ( done )
    const { config: increaseAllowanceConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: agencyStableAbi,
        functionName: 'increaseAllowance',
        args: [spender, amountWei],
    })
    return increaseAllowanceConfig;
}
// treasury seed specific
export  function prepareSeedWrite(contractAddress: any, abi: any, amountWei: string){
    const { config: treasurySeedConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: agencyTreasurySeedAbi,
        functionName: 'seed',
        args: [amountWei],
        // not sure if necessary
        overrides: { gasLimit: BigNumber.from(600000) }
    })
    return treasurySeedConfig;
}