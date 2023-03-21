{/* <div id="dropdown" ref={additionalTradeInfoPopoverDropdownRef} className={(additionalTradeInfoDropdownPopoverShow ? "block " : "hidden ") + (color === "white" ? "bg-white " : backgroundColor1 + " ") +
  "absolute text-base z-10 float-right h-2/6 w-1/5 py-2 list-none rounded-2xl border-4 border-black border-solid shadow-lg mx-0	my-0 p-5 xsm:min-w-250"
} style={{minWidth: Math.max(0.8 * amountInInputWidth, 250), minHeight: 3 * amountInInputHeight + 5 }}>
  <div className="flex flex-col space-y-1 py-4 text-sm dark:text-gray-400 p-2">
    <div className="mb-3 xl:mb-4 2xl:mb-4">
      <h3 className="float-left text-lg text-black">More details</h3>
      <h3 className="float-right text-lg text-black hover:cursor-pointer" onClick={() => { if (additionalTradeInfoDropdownPopoverShow) { closeAdditionalTradeInfoDropdownPopover() } }}>X</h3>
    </div>
    <div className="float-left"><h2 className="text-black">Expected output</h2></div>
    <div className="float-left"><h2>{expectedAmount} $AGENCY</h2></div>
    <div className="float-left"><h2 className="text-black">Price impact</h2></div>
    <div className="float-left"><h2>0%</h2></div>
    <div className="float-left"><h2 className="text-black">Minimum received after slippage ( %0.5 )</h2></div>
    <div className="float-left"><h2>{expectedAmount} $AGENCY</h2></div>
    <div className="float-left"><h2 className="text-black">Network fee</h2></div>
    <div className="float-left"><h2>~$1.72</h2></div>
  </div>
</div> */}
export default function AdditionalTradeInformationPopover({...props}){
    const color = "white";
    const backgroundColor1 = "yellow";

    return(
        <div id="dropdown" ref={props.additionalTradeInfoPopoverDropdownRef} className={(props.additionalTradeInfoDropdownPopoverShow ? "block " : "hidden ") + (color === "white" ? "bg-white " : backgroundColor1 + " ") +
        "absolute text-base z-10 float-right h-2/6 w-1/5 py-2 list-none rounded-2xl border-4 border-black border-solid shadow-lg mx-0	my-0 p-5 xsm:min-w-250"
      } style={{minWidth: Math.max(0.8 * props.amountInInputWidth, 250), minHeight: 3 * props.amountInInputHeight + 5 }}>
          <div className="flex flex-col space-y-1 py-4 text-sm dark:text-gray-400 p-2">
            <div className="mb-3 xl:mb-4 2xl:mb-4">
              <h3 className="float-left text-lg text-black">More details</h3>
              <h3 className="float-right text-lg text-black hover:cursor-pointer" onClick={() => { if (props.additionalTradeInfoDropdownPopoverShow) { props.closeAdditionalTradeInfoDropdownPopover() } }}>X</h3>
            </div>
            <div className="float-left"><h2 className="text-black">Expected output</h2></div>
            <div className="float-left"><h2>{props.expectedAmount} $AGENCY</h2></div>
            <div className="float-left"><h2 className="text-black">Price impact</h2></div>
            <div className="float-left"><h2>0%</h2></div>
            <div className="float-left"><h2 className="text-black">Minimum received after slippage ( %0.5 )</h2></div>
            <div className="float-left"><h2>{props.expectedAmount} $AGENCY</h2></div>
            <div className="float-left"><h2 className="text-black">Network fee</h2></div>
            <div className="float-left"><h2>~$1.72</h2></div>
          </div>
      </div>
    )
}