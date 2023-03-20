import React from "react";
import Image from 'next/image';

{/* <button className="w-1/6 h-1/2" onClick={() => {
currenciesDropdownPopoverShow
    ? closeCurrenciesDropdownPopover()
    : openCurrenciesDropdownPopover();
}}
><Image alt="deployment test" src={dropDownSvg} style={imageStyle}></Image></button> */}
export default function CurrenciesButton({...props}){
    return(
    <button className="w-1/6 h-1/2" onClick={() => {
        props.currenciesDropdownPopoverShow
        ? props.closeCurrenciesDropdownPopover()
        : props.openCurrenciesDropdownPopover();
    }}
    >
    <Image alt="deployment test" src={props.dropDownSvg} style={props.imageStyle}></Image>
    </button>
    )
}