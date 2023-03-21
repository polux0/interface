import React from "react";
import Image from 'next/image';

{/* <div className="w-full h-1/6">
<button className="float-right" onClick={() => {
  settingsDropdownPopoverShow
    ? closeSettingsDropdownPopover()
    : openSettingsDropdownPopover();
}}><Image alt="deployment test" src={settingsSvg}></Image></button>
</div> */}

export default function SettingsButton({...props}){
    return (
        <div className="w-full h-1/6">
            <button className="float-right" onClick={() => {
            props.settingsDropdownPopoverShow
                ? props.closeSettingsDropdownPopover()
                : props.openSettingsDropdownPopover();
            }}>
            <Image alt="deployment test" src={props.settingsSvg}></Image></button>
        </div>
    )
}