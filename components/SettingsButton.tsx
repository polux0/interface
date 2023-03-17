import React from "react";
import { createPopper } from "@popperjs/core";
import Image from 'next/image';


{/* <div className="w-full h-1/6">
<button className="float-right" onClick={() => {
  settingsDropdownPopoverShow
    ? closeSettingsDropdownPopover()
    : openSettingsDropdownPopover();
}}><Image alt="deployment test" src={settingsSvg}></Image></button>
</div> */}

export default function SettingsButton({...props}){
    const [settingsDropdownPopoverShow, setSettingsDropdownPopoverShow] = React.useState(false);
    const settingsButtonDropdownPopoverShow: any = React.createRef();
    const settingsPopoverDropdownRef: any = React.createRef();

    const openSettingsDropdownPopover = () => {
        createPopper(settingsButtonDropdownPopoverShow.current, settingsPopoverDropdownRef.current, {
          placement: "bottom-start"
        });
        setSettingsDropdownPopoverShow(true);
      };
      // close settings dropdown
      const closeSettingsDropdownPopover = () => {
        setSettingsDropdownPopoverShow(false);
      };
    return (
        <div className="w-full h-1/6">
            <button className="float-right" onClick={() => {
            settingsDropdownPopoverShow
                ? closeSettingsDropdownPopover()
                : openSettingsDropdownPopover();
            }}>
            <Image alt="deployment test" src={props.settingsSvg}></Image></button>
      </div>
      
    )
}