import exchangeTo from '@/styles/exchange/ExchangeTo.module.css'
export default function ExchangeTo(){
    return(
        <div className={exchangeTo.main}>
        <input className = {exchangeTo.label}type="number" id="exchangeto" name="exchangeto" />
        </div>
    )
}