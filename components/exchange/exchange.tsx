import ExchangeFrom from "./exchangefrom"
import ExchangeTo from "./exchangeto"
import exchangeStyles from "@/styles/exchange/Exchange.module.css"
import ExchangeButton from './exchangebutton'
import { ConnectButton } from '@rainbow-me/rainbowkit';


export default function Exchange({...props}){
    const {walletConnected} = props;
    return (
        <div className={exchangeStyles.main}>
            <ExchangeFrom></ExchangeFrom>
            <ExchangeTo></ExchangeTo>
            <ConnectButton></ConnectButton>
            <ExchangeButton></ExchangeButton> 
            {/* {isWalletConnected(walletConnected)} */}
        </div>
    )
}
function isWalletConnected(connected: boolean){
    return connected ? <ExchangeButton></ExchangeButton> : <ConnectButton></ConnectButton>
}