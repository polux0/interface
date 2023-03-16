
enum AccountActionStatus {
    CONNECT_WALLET = "Connect wallet",
    SWITCH_NETWORK = "Switch network",
}
// This should replace Enums as types ( only to enable composabillity via inheritance)
class AccountActionStates implements IAccountActionStates{
    isConnected: string;
    isChainSupported: string;

constructor() {
    this.isConnected = CONNECT_WALLET;
    this.isChainSupported = SWITCH_NETWORK;
}

// state / value / display message
establishAccountStateAndAction(){
    if(!isConnected()){

    }

}
// if(!isConnected()){
//     return ActionStatus.CONNECT_WALLET && openConnectModal;
// }
// if(!isChainSupported(chain)){
//     return ActionStatus.SWITCH_NETWORK && openChainModal;
// }
// if(isConnectedAndIsChainSupported(chain)){
//     return addressFormater(address ?? "") && openAccountModal
// }

}