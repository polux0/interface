import React from "react";
import { createPopper } from "@popperjs/core";
import Image from 'next/image';


{/* <div id="dropdown" ref={settingsPopoverDropdownRef} className={(settingsDropdownPopoverShow ? "block " : "hidden ") + (color === "white" ? "bg-white " : backgroundColor1 + " ") +
"absolute text-base z-10 float-right w-1/6 h-2/6 py-2 list-none text-center rounded-2xl border-4 border-black border-solid shadow-lg p-5 mt-40"
} style={{minWidth: '250px', marginLeft: Math.max(amountInInputWidth - 250, 0)}}>
<h3 className='text-black xsm:mb-1'>Slippage tolerance</h3>
<div className="flex flex-col h-4/5 py-2 text-sm dark:text-gray-400">
  <div className="flex justify-center items-center text-center w-6/6 h-1/3 bg-white">
    <button className="w-1/4 h-full rounded-2xl border-2 border-gray mr-1">
      Auto
    </button>
    <input className="w-3/4 text-2xl text-white text-center p-4 rounded-2xl focus:outline-0" value={"0,5 %"} style={{ backgroundColor }} onChange={e => { }}></input>
  </div>
  <div className="w-6/6 h-full p-2 bg-white xsm:mt-2.5">
    <div className="w-4/4 text-1xl">
      Your transaction will revert if the price changes unfavorably by more than this percentage during your order.
    </div>
  </div>
</div>
</div> */}


export default function SettingsPopover({...props}){
    const backgroundColor = "#1A1B23";
    return (
        <div id="dropdown" ref={props.settingsPopoverDropdownRef} className={(props.settingsDropdownPopoverShow ? "block " : "hidden ") + (props.color === "white" ? "bg-white " : props.backgroundColor1 + " ") +
        "absolute text-base z-10 float-right w-1/6 h-2/6 py-2 list-none text-center rounded-2xl border-4 border-black border-solid shadow-lg p-5 mt-40"
      } style={{minWidth: '250px', marginLeft: Math.max(props.amountInInputWidth - 250, 0)}}>
        <h3 className='text-black xsm:mb-1'>Slippage tolerance</h3>
        <div className="flex flex-col h-4/5 py-2 text-sm dark:text-gray-400">
          <div className="flex justify-center items-center text-center w-6/6 h-1/3 bg-white">
            <button className="w-1/4 h-full rounded-2xl border-2 border-gray mr-1">
              Auto
            </button>
            <input className="w-3/4 text-2xl text-white text-center p-4 rounded-2xl focus:outline-0" value={"0,5 %"} style={{ backgroundColor }} onChange={e => { }}></input>
          </div>
          <div className="w-6/6 h-full p-2 bg-white xsm:mt-2.5">
            <div className="w-4/4 text-1xl">
              Your transaction will revert if the price changes unfavorably by more than this percentage during your order.
            </div>
          </div>
        </div>
      </div>
    )
}