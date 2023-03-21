// import React from "react";
// import Image from 'next/image';

// {/* <button className="w-1/6 h-1/2" onClick={() => {
// currenciesDropdownPopoverShow
//     ? closeCurrenciesDropdownPopover()
//     : openCurrenciesDropdownPopover();
// }}
// ><Image alt="deployment test" src={dropDownSvg} style={imageStyle}></Image></button> */}
// export default function TradeInfoButton({...props}){
//     return(
//         <button className="w-1/6 h-1/9" onClick={() => {
//             additionalTradeInfoDropdownPopoverShow
//               ? closeAdditionalTradeInfoDropdownPopover()
//               : openAdditionalTradeInfoDropdownPopover();
              
//           }}>
//             {/* information indicator */}
//             <Image className="hidden" alt="deployment test" src={informationIndicatorWhite} style={{display: transactionStatus === TransationStatus.DEFAULT ? "block" : "none", marginLeft: "auto", marginRight: "auto"}}></Image>
//             {/* loading indicator */}
//             <span className="loader float-left 2xl:ml-4	xl:ml-4 lg:ml-3.5 md:ml-2.5 sm:ml-2 xsm:ml-0.5 h-9 w-9" style={{display: transactionStatus === TransationStatus.LOADING ? "block" : "none"}}></span>
//             {/* success indicator */}
//             <Image className="success" alt="deployment test" src={successIndicator} style={{display: transactionStatus === TransationStatus.SUCCESS ? "block" : "none", marginLeft: "auto", marginRight: "auto"}}></Image>
//             {/* error indicator */}
//             <Image className="error" alt="deployment test" src={errorIndicator} style={{display: transactionStatus === TransationStatus.ERROR ? "block" : "none", marginLeft: "auto", marginRight: "auto"}}></Image>
//           </button>
//     )
// }