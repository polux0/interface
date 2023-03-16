enum AccountActionStatus {
    CONNECT_WALLET = "Connect wallet",
    SWITCH_NETWORK = "Switch network",
}
enum ExchangeActionStatus {
    ENTER_AN_AMOUNT = "Enter an amount",
    INSSUFICIENT_STABLES = "Insufficient USDC balance",
    INCREASE_ALLOWANCE = "Increase allowance",
    EXCHANGE = "Swap",
}
// This should replace Enums as types ( only to enable composabillity via inheritance)
class ExchangeActionStates implements IAccountActionStates{
    isInsufficientAmount: string;
    isInsufficientStables: string;
    isAbleToIncreaseAllowance: string;
    isAbleToExchange: string;

constructor() {
    this.isConnected = CONNECT_WALLET;
    this.isChainSupported = SWITCH_NETWORK;
    this.isInsufficientAmount = ENTER_AN_AMOUNT;
    this.isInsufficientStables = INSSUFICIENT_STABLES;
    this.isAbleToIncreaseAllowance = INCREASE_ALLOWANCE;
    this.isAbleToExchange = EXCHANGE;
}

    // determine account state?
    // define if 
    // function determineAccountState(){
    //     // We need map that consist of action state & action value
    //     if(!isConnected()){
    //         return ActionStatus.CONNECT_WALLET && openConnectModal;
    //     }
    //     if(!isChainSupported(chain)){
    //         return ActionStatus.SWITCH_NETWORK && openChainModal;
    //     }
    //     if(isConnectedAndIsChainSupported(chain)){
    //         return addressFormater(address ?? "") && openAccountModal
    //     }
    // }

}