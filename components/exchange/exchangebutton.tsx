
{/* <div className="w-5/6 h-2/6 rounded-2xl border-4 border-black border-solid">
<button className="w-full text-black bg-white h-full rounded-2xl"
  onClick= {
    determineButtonAction()
    }>
    {determineButtonValue()}
</button>
</div> */}
export default function ExchangeButton({...props}){
    return(
        <div className="w-5/6 h-2/6 rounded-2xl border-4 border-black border-solid">
        <button className="w-full text-black bg-white h-full rounded-2xl"
          onClick = {props.determineButtonAction()}> 
          {props.determineButtonValue()}
        </button>
      </div>
    )
}