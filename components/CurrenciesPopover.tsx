import Image from 'next/image';

{/* <div id="dropdown" ref={currenciesPopoverDropdownRef} className={(currenciesDropdownPopoverShow ? "block " : "hidden ") + (color === "white" ? "bg-white " : backgroundColor1 + " ") +
"absolute text-base z-10 float-right w-1/6 py-2 list-none text-center rounded-2xl border-4 border-black border-solid shadow-lg mt-40"
} style={{minWidth: '250px', marginLeft: Math.max(amountInInputWidth - 250, 0)}}>
<h3 className='text-black'>Choose token ( soon )</h3>
<div className="flex flex-col py-2 text-sm dark:text-gray-400 p-5">
  <div onClick={() => {  closeCurrenciesDropdownPopover() }} className="flex justify-center items-center w-6/6 h-1/9 p-2 rounded-2xl border-2 border-gray hover:text-black hover:border-black hover:cursor-pointer border-solid mb-2.5 bg-white">
    <button className="w-1/4"><Image alt="deployment test" src={usdcDarkSvg}></Image></button>
    <div className="w-3/4 float-left mr-9"> $USDC </div>
  </div>
  <div onClick={() => {  closeCurrenciesDropdownPopover() }} className="flex justify-center items-center w-6/6 h-1/9 p-2 rounded-2xl border-2 border-black text-black hover:border-black hover:cursor-pointer border-solid mb-2.5 bg-white">
    <button className="w-1/4"><Image alt="deployment test" src={usdcDarkSvg}></Image></button>
    <div className="w-3/4 float-left mr-9"> $FRAX </div>
  </div>
  <div onClick={() => {  closeCurrenciesDropdownPopover() }} className="flex justify-center items-center w-6/6 h-1/9 p-2 rounded-2xl border-2 border-black text-black hover:border-black hover:cursor-pointer border-solid mb-2.5 bg-white">
    <button className="w-1/4"><Image alt="deployment test" src={usdcDarkSvg}></Image></button>
    <div className="w-3/4 float-left mr-9"> $USDT </div>
  </div>
</div>
</div> */}
export default function CurrenciesPopover({...props}){
    const color = "white";
    const backgroundColor1 = "yellow";

    return(
        <div id="dropdown" ref={props.currenciesPopoverDropdownRef} 
                           className={(props.currenciesDropdownPopoverShow ? "block " : "hidden ") + (color === "white" ? "bg-white " : backgroundColor1 + " ") + "absolute text-base z-10 float-right w-1/6 py-2 list-none text-center rounded-2xl border-4 border-black border-solid shadow-lg mt-40"}
                           style={{minWidth: '250px', marginLeft: Math.max(props.amountInInputWidth - 250, 0)}}>
            <h3 className='text-black'>Choose token ( soon )</h3>
                <div className="flex flex-col py-2 text-sm dark:text-gray-400 p-5">
                    {/* each of this <div> should be component for itself */}
                    <div onClick={() => {  props.closeCurrenciesDropdownPopover() }} className="flex justify-center items-center w-6/6 h-1/9 p-2 rounded-2xl border-2 border-gray hover:text-black hover:border-black hover:cursor-pointer border-solid mb-2.5 bg-white">
                        <button className="w-1/4"><Image alt="deployment test" src={props.usdcDarkSvg}></Image></button>
                        <div className="w-3/4 float-left mr-9"> $USDC </div>
                    </div>
                    {/* each of this <div> should be component for itself */}
                    <div onClick={() => {  props.closeCurrenciesDropdownPopover() }} className="flex justify-center items-center w-6/6 h-1/9 p-2 rounded-2xl border-2 border-black text-black hover:border-black hover:cursor-pointer border-solid mb-2.5 bg-white">
                        <button className="w-1/4"><Image alt="deployment test" src={props.usdcDarkSvg}></Image></button>
                        <div className="w-3/4 float-left mr-9"> $FRAX </div>
                    </div>
                    {/* each of this <div> should be component for itself */}
                    <div onClick={() => {  props.closeCurrenciesDropdownPopover() }} className="flex justify-center items-center w-6/6 h-1/9 p-2 rounded-2xl border-2 border-black text-black hover:border-black hover:cursor-pointer border-solid mb-2.5 bg-white">
                        <button className="w-1/4"><Image alt="deployment test" src={props.usdcDarkSvg}></Image></button>
                        <div className="w-3/4 float-left mr-9"> $USDT </div>
                    </div>
                </div>
        </div>        
      )
}