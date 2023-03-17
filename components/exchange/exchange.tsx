import React, { useLayoutEffect } from "react";
import { useEffect, useRef, useState } from "react";
import { ethers } from 'ethers';
import { Chain, useAccount, useBalance, useContractRead, useContractWrite, usePrepareContractWrite, useProvider, useWaitForTransaction } from 'wagmi'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { agencyStableAbi, agencyTreasurySeedAbi } from '../../contracts/abis'
import useDebounce from '../../hooks/Debounce';
import useIsomorphicLayoutEffect from "@/hooks/IsomporphicLayoutEffect";
import { BigNumber } from 'ethers';
import Image from 'next/image';

import { useNetwork } from 'wagmi'
import { addresses, GOERLI_ID } from "../../contracts"

// technical debt - create separate module
import settingsSvg from "../../public/noun-settings-pixel-art-2758641.svg";
import usdcSvg from "../../public/usdc-logo-svg.svg"
import usdcDarkSvg from "../../public/usdc-logo-dark-svg.svg"
import dropDownSvg from "../../public/dropdown-indicator.svg"
import informationIndicatorWhite from "../../public/information-indicator-white.svg"
import agencyLogoSvg from "../../public/agency-logo.svg";
import roadmapSvg from "../../public/roadmapicon-svg.svg";
import statsSvg from "../../public/stats-icon-svg.svg";
import userWalletMobileScreenSvg from "../../public/user-wallet-small-screen-svg.svg";
import successIndicator from "../../public/success-indicator-svg.svg"
import errorIndicator from "../../public/error-indicator-svg.svg"
import accountModalOpenIndicator from "../../public/another-dropdown-indicator.svg"


import { useIsMounted } from "../../helpers/useIsMounted"
import { createPopper } from "@popperjs/core";

import {
  useConnectModal,
  useAccountModal,
  useChainModal,
} from '@rainbow-me/rainbowkit';
import { addressFormater } from '@/helpers/addressFormater';
// technical debt
import validationz from '@/helpers/validation';
import Account from "../shared/account";
import Logo from "../shared/header/logo";
import AccountMobile from "../shared/header/accountMobile";
import Header from "../shared/header/header";

export default function Exchange({ ...props }) {

  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const mounted = useIsMounted();
  const { address, isConnecting, isDisconnected } = useAccount()
  const isConnected = !isDisconnected;
  const { chain, chains } = useNetwork()

  const { data, isError, isLoading } = useBalance({
    address: address,
    token: "0xD7295ab92c0BAe514dC33aB9Dd142f7d10AC413b"
  })
  // technical debt: 
  // 1. adapt styles / css for components
  // 2. add margin from swap modal that will be percentage of screen height
  // 3. introduce responsivness in modals ( select currency, additional trade info, settings )

  const backgroundColor = "#1A1B23";
  const imageStyle = {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto"
  };
  const exchangeContainerHeight = { height: "500px" };
  const color = "white";
  const backgroundColor1 = "yellow";

  const amountInInputRef: any = useRef();
  // technial debt? this could be componentized
  // currencies dropdown
  const [currenciesDropdownPopoverShow, setCurrenciesDropdownPopoverShow] = React.useState(false);
  const currenciesButtonDropdownRef: any = React.createRef();
  const currenciesPopoverDropdownRef: any = React.createRef();
  // settings dropdown
  const [settingsDropdownPopoverShow, setSettingsDropdownPopoverShow] = React.useState(false);
  const settingsButtonDropdownPopoverShow: any = React.createRef();
  const settingsPopoverDropdownRef: any = React.createRef();
  // additional trade info dropdown
  const [additionalTradeInfoDropdownPopoverShow, setAdditionalTradeInfoDropdownPopoverShow] = React.useState(false);
  const additionalTradeInfoButtonDropdownPopoverShow: any = React.createRef();
  const additionalTradeInfoPopoverDropdownRef: any = React.createRef();

  // open currencies dropdown
  const openCurrenciesDropdownPopover = () => {
    createPopper(currenciesButtonDropdownRef.current, currenciesPopoverDropdownRef.current, {
      placement: "bottom-start"
    });
    setCurrenciesDropdownPopoverShow(true);
  };
  // close currencies dropdown
  const closeCurrenciesDropdownPopover = () => {
    setCurrenciesDropdownPopoverShow(false);
  };

  // open settings dropdown
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

  // open additional trade information dropdown
  const openAdditionalTradeInfoDropdownPopover = () => {
    createPopper(additionalTradeInfoButtonDropdownPopoverShow.current, additionalTradeInfoPopoverDropdownRef.current, {
      placement: "bottom-start"
    });
    setAdditionalTradeInfoDropdownPopoverShow(true);
  };
  // close settings dropdown
  const closeAdditionalTradeInfoDropdownPopover = () => {
    setAdditionalTradeInfoDropdownPopoverShow(false);
  };

  // technical debt - move it somewhere
  enum TransationStatus {
    DEFAULT = "DEFAULT",
    LOADING = "LOADING",
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
  }
  enum ActionStatus {
    CONNECT_WALLET = "Connect wallet",
    SWITCH_NETWORK = "Switch network",
    INCREASE_ALLOWANCE = "Increase allowance",
    INSSUFICIENT_STABLES = "Insufficient USDC balance",
    EXCHANGE = "Swap",
    ENTER_AN_AMOUNT = "Enter an amount"
  }

  enum AccountActionStatus {
    CONNECT_WALLET = "Connect wallet",
    SWITCH_NETWORK = "Switch network",
  }


  interface Validation{
    isConnected: boolean,
    isChainSupported: boolean,
    isAmountEntered: boolean,
    isEnoughAllowance: boolean,
    isEnoughStables: boolean,
  }

  // technical debt
  // 2. create config for contracts ( hooks )
  const account = useAccount();
  const provider = useProvider();


  const [amount, setAmount] = useState("0");
  const [amountWei, setAmountWei] = useState("0");
  const [amountWeiActualButCurentPlaceHolder, setAmountWeiActualButCurentPlaceHolder] = useState("0");
  const [currentAllowanceWei, setCurrentAllowanceWei] = useState("0");
  const [expectedAmount, setExpectedAmount] = useState("0");
  const [transactionStatus, setTransactionStatus] = React.useState<TransationStatus>(TransationStatus.DEFAULT);
  const [amountInInputWidth, setAmountInInputWidth] = React.useState(0);
  const [amountInInputHeight, setAmountInInputHeight] = React.useState(0);

  const debouncedInputAmount = useDebounce(amount, 800);

  // technical debt 
  // user should set it's `deadline` as well as `slippage`

  let amountWeiNormalized: unknown;
  let amountMinOutWeiValue;
  try {
    amountWeiNormalized = ethers.utils.parseUnits(amountWei.toString(), "ether").toString();
    amountMinOutWeiValue = BigNumber.from(amountWei).sub(BigNumber.from(amountWei).div(10));
  } catch (error) {
    amountWeiNormalized = "0";
    amountMinOutWeiValue = BigNumber.from("0");
  }
  // technical debt - move all of those functions to separate module
  // 🤖 deployer address 0xD3d5B16a5B25AafffC9A9459Af4de2a38bc8d659
  // 🎥 agency deployed at 0x40B2911A8f9ff3B5a806e79DA7F9445ff3970362
  // 🎥 agency stable deployed at 0xD7295ab92c0BAe514dC33aB9Dd142f7d10AC413b
  // 🎥 agency treasury deployed at 0x5c41C8AF1C022ECadf1C309F8CCA489A93077a8b
  // 🎥 agency treasury seed deployed at 0xb08a51B76A5c00827336903598Dce825912bDeCc

  // fetch alowance ( treasurySeedContract.address <> account.address )( done )
  const { refetch: fetchAllowance } = useContractRead({
    address: '0xD7295ab92c0BAe514dC33aB9Dd142f7d10AC413b',
    abi: agencyStableAbi,
    functionName: 'allowance',
    args: [account.address, "0xb08a51B76A5c00827336903598Dce825912bDeCc"],
    enabled: false,
  })
  // fetch quote ( done )
  const { refetch: fetchQuote } = useContractRead({
    address: '0xb08a51B76A5c00827336903598Dce825912bDeCc',
    abi: agencyTreasurySeedAbi,
    functionName: 'getSeedQuote',
    args: [amountWei],
    enabled: false,
  })
  // increase allowance ( account.address <> treasurySeedContract.address ) ( done )
  const { config: increaseAllowanceConfig } = usePrepareContractWrite({
    address: '0xD7295ab92c0BAe514dC33aB9Dd142f7d10AC413b',
    abi: agencyStableAbi,
    functionName: 'increaseAllowance',
    args: ["0xb08a51B76A5c00827336903598Dce825912bDeCc", amountWeiNormalized],
  })
  // treasurySeed ( done )
  const { config: swapExactFraxForTempleConfig } = usePrepareContractWrite({
    address: '0xb08a51B76A5c00827336903598Dce825912bDeCc',
    abi: agencyTreasurySeedAbi,
    functionName: 'seed',
    args: [amountWeiNormalized],
    // not sure if necessary
    overrides: { gasLimit: BigNumber.from(600000) }
  })

  // config of contractWrite 
  const { write: increaseAllowanceWrite, data: increaseAllowanceData } = 
  useContractWrite({
    ... increaseAllowanceConfig,
    onSettled(data, error) {
      error ? setTransactionStatus(TransationStatus.ERROR) : setTransactionStatus(TransationStatus.LOADING)
    },
  },)
  const { write: swapExactFraxForTempleWrite, data: swapExactFraxForTempleWriteData } = 
  useContractWrite({
    ...swapExactFraxForTempleConfig,
    onSettled(data, error) {
      error ? setTransactionStatus(TransationStatus.ERROR) : setTransactionStatus(TransationStatus.LOADING)
    },})

  // technical debt - optimize only to be used when chain is changed
  function isChainSupported(chain: any){
    return chain && chains ? chains.map(chain => chain.id).includes(chain.id) : false; 
  }
  function isConnectedAndIsChainSupported(chain: any){
    return isConnected && isChainSupported(chain);
  }
  useWaitForTransaction({
    confirmations: 1,
    hash: increaseAllowanceData?.hash,
    onSettled(data, error) {
      fetchAllowance?.().then(increaseAllowancePromise => {
        const updatedAllowance = increaseAllowancePromise?.data as string
        setCurrentAllowanceWei(updatedAllowance.toString());
        error? setTransactionStatus(TransationStatus.ERROR) : setTransactionStatus(TransationStatus.SUCCESS)
      })
    },
  });
  useWaitForTransaction({
    confirmations: 1,
    hash: swapExactFraxForTempleWriteData?.hash,
    onSettled(data, error) {
      // check for agency balance and increase ?
      error? setTransactionStatus(TransationStatus.ERROR) : setTransactionStatus(TransationStatus.SUCCESS)
    },
  });

  // technical debt
  // move this into /hooks
  useEffect(
    () => {
      if (debouncedInputAmount) {
        if(Number(amount) > 0 && isChainSupported(chain)){
          fetchAllowance?.().then(currentAllowancePromise => {
            const result = currentAllowancePromise?.data as string
            setCurrentAllowanceWei(result.toString());
          })
          fetchQuote?.().then(quote => {
            const result = quote?.data as any;
            let amountOutAMM, amountOutProtocol, amountOut;
            try {
              amountOut = ethers.utils.formatUnits(result, "wei") || 0;
            } catch (error) {
              amountOutAMM = 0
              amountOutProtocol = 0
              amountOut = 0
            }
            setExpectedAmount(amountOut.toString())
          });
        }
      } else {
        setCurrentAllowanceWei(currentAllowanceWei);
        setExpectedAmount("0")
      }
    },
    [amount, chain, currentAllowanceWei, debouncedInputAmount, fetchAllowance, fetchQuote, isChainSupported, provider] // Only call effect if debounced search term changes
  );
  
  // technical debt
  // move this into /hooks
  useEffect(() => {
    if(transactionStatus == TransationStatus.ERROR || transactionStatus == TransationStatus.SUCCESS){
      setTimeout(function() { setTransactionStatus(TransationStatus.DEFAULT) }, 6000);
    }
  }, [TransationStatus.DEFAULT, TransationStatus.ERROR, TransationStatus.SUCCESS, transactionStatus]);

  // technical debt
  // move this into /hooks

  useLayoutEffect(() => {
      console.log("addresses: ", addresses[1337])
      setAmountInInputWidth(amountInInputRef.current.clientWidth)
      setAmountInInputHeight(amountInInputRef.current.clientHeight)
  }, []);

  // tehnical debt
  // determineButtonAction() && determineButtonValue() could be merged into one function using Map<T,T>
  // isMounted is everywhere, so it should be merged
  function determineButtonAction(){
    const validation: Validation = {
      isConnected: true,
      isChainSupported: true,
      isAmountEntered: true,
      isEnoughStables: true,
      isEnoughAllowance: true,
    };
    if(!isConnected){
      validation.isConnected = false;
      return openConnectModal;
    }
    if(!isChainSupported(chain)){
      validation.isChainSupported = false;
      return openChainModal;
    }
    if(!validationz.isAmountEntered(amount)){
      validation.isAmountEntered = false;
      return;
    }
    if(!validationz.isEnoughStables(data?.value.toString() ?? "0", amountWeiActualButCurentPlaceHolder)){
      validation.isEnoughStables = false;
      return;
    }
    if(!validationz.isEnoughAllowance(amount, currentAllowanceWei)){
      validation.isEnoughAllowance = false;
      return increaseAllowanceWrite;
    }
    let exchangePreconditionsFulfilled: Boolean = true
    for(const [key, value] of Object.entries(validation)){
      if(value === false){
          exchangePreconditionsFulfilled = false
      }
    }
    if(exchangePreconditionsFulfilled){
      return swapExactFraxForTempleWrite;
    }
  }
  function determineButtonValue(){
    const validation: Validation = {
      isConnected: true,
      isChainSupported: true,
      isAmountEntered: true,
      isEnoughStables: true,
      isEnoughAllowance: true,
    };
    if(mounted && !isConnected){
      validation.isConnected = false;
      // console.log(validation)
      return ActionStatus.CONNECT_WALLET;
    }
    if(mounted && !isChainSupported(chain)){
      validation.isChainSupported = false;
      // console.log(validation)
      return ActionStatus.SWITCH_NETWORK;
    }
    if(mounted && !validationz.isAmountEntered(amount)){
      validation.isAmountEntered = false;
      return ActionStatus.ENTER_AN_AMOUNT;
    }
    if(mounted && !validationz.isEnoughStables(data?.value.toString() ?? "0", amountWeiActualButCurentPlaceHolder)){
      validation.isEnoughStables = false;
      // console.log('INSSUFICIENT_STABLES', validation)
      return ActionStatus.INSSUFICIENT_STABLES
    }
    if(mounted && !validationz.isEnoughAllowance(amountWei, currentAllowanceWei)){
      validation.isEnoughAllowance = false;
      // console.log(validation)
      return ActionStatus.INCREASE_ALLOWANCE;
    }
    let exchangePreconditionsFulfilled: Boolean = true
    for(const [key, value] of Object.entries(validation)){
      if(value === false){
          exchangePreconditionsFulfilled = false  
      }
    }
    if(exchangePreconditionsFulfilled){
      // console.log('exchange', validation)
      return ActionStatus.EXCHANGE;
    }
  }
  // technical debt - make base Validation interface
  interface AccountValidation{
    isConnected: boolean,
    isChainSupported: boolean,
  }
  function determineAccountValue(){
   const validation: AccountValidation = {
    isConnected: true, 
    isChainSupported: true,
   }
   if(mounted && !isConnected){
    validation.isConnected = false;
    return ActionStatus.CONNECT_WALLET;
  }
  if(mounted && !isChainSupported(chain)){
    validation.isChainSupported = false;
    return ActionStatus.SWITCH_NETWORK;
  }
  if(mounted && isConnectedAndIsChainSupported(chain)){
    return mounted ? addressFormater(address ?? "") : ""
  }
  }
  function determineAccountAction(){
    if(mounted && !isConnected){
      return openConnectModal;
    }
    if(mounted && !isChainSupported(chain)){
      return openChainModal;
    }
    if(mounted && isConnectedAndIsChainSupported(chain)){
      return openAccountModal;
    }
  }
  
  async function amountHandler(event: any) {
    const amount: any = event.target.value;
    let amountWei;
    try {
      amountWei = ethers.utils.formatUnits(amount, "wei");
    } catch (error) {
      amountWei = "0";
    }
    setAmount(amount);
    setAmountWeiActualButCurentPlaceHolder(ethers.utils.parseUnits(amount,"ether").toString())
    setAmountWei(amountWei)
  }
  // experimenting
  return (
    
    <div className="h-screen bg-black p-6" style={{ backgroundColor }}>
      {/* Header */}
      <Header agencyLogoSvg = {agencyLogoSvg} 
              determineAccountAction = {determineAccountAction}
              mounted = {mounted}
              determineAccountValue = {determineAccountValue}
              accountModalOpenIndicator = {accountModalOpenIndicator}
              userWalletMobileScreen = {userWalletMobileScreenSvg}
      />
      <div className="flex flex-row w-full min-h-3/4 lg:mt-36 justify-center items-center md:mt-36 sm:mt-36 xsm:mt-1">
        {/* //Roadmap */}
        <div className="float-left w-4/12 xsm:hidden 2xl:block xl:block lg:block md:block sm:block">
          <button><Image src={roadmapSvg} alt="deployment test" style={imageStyle}></Image></button>
        </div>
        <div className="h-max 2xl:w-4/12 xl:w-5/12 lg:w-6/12 bg-white rounded-3xl p-6" style={exchangeContainerHeight}>
          <div className="w-full h-1/6">
            <button className="float-right" onClick={() => {
              settingsDropdownPopoverShow
                ? closeSettingsDropdownPopover()
                : openSettingsDropdownPopover();
            }}><Image alt="deployment test" src={settingsSvg}></Image></button>
          </div>
          {/* Swap */}
          <div className="flex flex-col justify-center items-center space-y-2 h-2/3">
            <div className="flex justify-center items-center w-5/6 h-2/6 rounded-2xl" ref={amountInInputRef} style={{ backgroundColor }}>
              <input className="w-2/3 h-2/3 text-4xl text-white p-4 focus:outline-0" style={{ backgroundColor }} type="number" min="0" value={amount} onChange={e => amountHandler(e)}></input>
              <button className="w-1/6 h-1/2"><Image alt="deployment test" className="float-right" src={usdcSvg}></Image></button>
              <button className="w-1/6 h-1/2" onClick={() => {
                currenciesDropdownPopoverShow
                  ? closeCurrenciesDropdownPopover()
                  : openCurrenciesDropdownPopover();
              }}
              ><Image alt="deployment test" src={dropDownSvg} style={imageStyle}></Image></button>
              {/* Settings dropdown */}
              <div id="dropdown" ref={settingsPopoverDropdownRef} className={(settingsDropdownPopoverShow ? "block " : "hidden ") + (color === "white" ? "bg-white " : backgroundColor1 + " ") +
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
              </div>
              {/* Settings dropdown */}
            </div>
            <div className="flex justify-center items-center w-5/6 h-2/6 rounded-2xl" style={{ backgroundColor }}>
              <input className="w-2/3 h-2/3 text-4xl text-white p-4 focus:outline-0" style={{ backgroundColor }} defaultValue={expectedAmount} type="number" min="0" onChange={e => { }}></input>
              <button className="w-1/6 h-1/2"><Image alt="deployment test" className="float-right" src={usdcSvg}></Image></button>
              <button className="w-1/6 h-1/9" onClick={() => {
                additionalTradeInfoDropdownPopoverShow
                  ? closeAdditionalTradeInfoDropdownPopover()
                  : openAdditionalTradeInfoDropdownPopover();
                  
              }}>
                {/* information indicator */}
                <Image className="hidden" alt="deployment test" src={informationIndicatorWhite} style={{display: transactionStatus === TransationStatus.DEFAULT ? "block" : "none", marginLeft: "auto", marginRight: "auto"}}></Image>
                {/* loading indicator */}
                <span className="loader float-left 2xl:ml-4	xl:ml-4 lg:ml-3.5 md:ml-2.5 sm:ml-2 xsm:ml-0.5 h-9 w-9" style={{display: transactionStatus === TransationStatus.LOADING ? "block" : "none"}}></span>
                {/* success indicator */}
                <Image className="success" alt="deployment test" src={successIndicator} style={{display: transactionStatus === TransationStatus.SUCCESS ? "block" : "none", marginLeft: "auto", marginRight: "auto"}}></Image>
                {/* error indicator */}
                <Image className="error" alt="deployment test" src={errorIndicator} style={{display: transactionStatus === TransationStatus.ERROR ? "block" : "none", marginLeft: "auto", marginRight: "auto"}}></Image>
              </button>
              {/* Currencies dropdown */}
              <div id="dropdown" ref={currenciesPopoverDropdownRef} className={(currenciesDropdownPopoverShow ? "block " : "hidden ") + (color === "white" ? "bg-white " : backgroundColor1 + " ") +
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
              </div>
              {/* Currencies dropdown */}
              {/* Additional trade info dropdown */}
              <div id="dropdown" ref={additionalTradeInfoPopoverDropdownRef} className={(additionalTradeInfoDropdownPopoverShow ? "block " : "hidden ") + (color === "white" ? "bg-white " : backgroundColor1 + " ") +
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
              </div>
            </div>
            <div className="w-5/6 h-2/6 rounded-2xl border-4 border-black border-solid">
              <button className="w-full text-black bg-white h-full rounded-2xl"
                onClick= {
                  determineButtonAction()
                  }>
                  {determineButtonValue()}
              </button>
            </div>
          </div>
        </div>
        {/* Stats */}
        <div className="w-4/12 float-right hover:cursor-pointer xsm:hidden sm:block md:block lg:block xl:block 2xl:block">
          <Image alt="deployment test" className="float-right" src={statsSvg}></Image>
        </div>
      </div>
      {/* Roadmap & Stats as a footer ( mobile ) */}
      <div className="w-full h-1/7 mt-3 2xl:hidden xl:hidden lg:hidden md:hidden sm:hidden">
        <div className="w-4/12 float-right hover:cursor-pointer">
          <Image alt="deployment test" className="" src={statsSvg} style={imageStyle}></Image>
        </div>
        <div className="w-4/12 float-left hover:cursor-pointer">
          <Image alt="deployment test" className="" src={roadmapSvg}></Image>
        </div>
        {/* Roadmap & Stats as a footer ( mobile ) */}
      </div>
    </div>
  )
}
