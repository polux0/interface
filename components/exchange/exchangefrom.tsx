import exchangeFrom from '@/styles/exchange/ExchangeFrom.module.css'
export default function ExchangeFrom(){
    return(
        <div className ={exchangeFrom.main}>
        <input className = {exchangeFrom.label} type="number" id="exchangefrom" name="exchangefrom" />
        </div>
    )
}