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
import Roadmap from "../shared/roadmap/roadmap";
import Stats from "../shared/Stats";
import RoadmapAndStatsMobile from "../shared/RodmapAndStatsMobile";
import ExchangeButton from "./exchangebutton";
import SettingsButton from "../SettingsButton";
import SettingsPopover from "../SettingsPopover";
import CurrenciesButton from "../CurrenciesButton";
import InformationIndicator from "../shared/indicators/InformationIndicator";
// import TradeInfoButton from "../TradeInfoButton";
import LoadingIndicator from "../shared/indicators/LoadingIndicator";
import SuccessIndicator from "../shared/indicators/SuccessIndicator";
import ErrorIndicator from "../shared/indicators/ErrorIndicator";
import CurrenciesPopover from "../CurrenciesPopover";
import AdditionalTradeInformationPopover from "../AdditionalTradeInformationPopover";

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
      // console.log("addresses: ", addresses[chain?.id])
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
        <Roadmap roadmapSvg = {roadmapSvg}
                 style = {imageStyle}/>
        {/* Exchange Container */}
        <div className="h-max 2xl:w-4/12 xl:w-5/12 lg:w-6/12 bg-white rounded-3xl p-6" style={exchangeContainerHeight}>
          {/* Settings Button*/}
          <SettingsButton settingsSvg={settingsSvg}
                          settingsButtonDropdownPopoverShow = {settingsButtonDropdownPopoverShow}
                          settingsPopoverDropdownRef = {settingsPopoverDropdownRef}
                          openSettingsDropdownPopover = {openSettingsDropdownPopover}
                          closeSettingsDropdownPopover = {closeSettingsDropdownPopover} />
          {/* Settings Button*/}
          {/* Swap */}
          <div className="flex flex-col justify-center items-center space-y-2 h-2/3">
            <div className="flex justify-center items-center w-5/6 h-2/6 rounded-2xl" ref={amountInInputRef} style={{ backgroundColor }}>
              <input className="w-2/3 h-2/3 text-4xl text-white p-4 focus:outline-0" style={{ backgroundColor }} type="number" min="0" value={amount} onChange={e => amountHandler(e)}></input>
              <button className="w-1/6 h-1/2"><Image alt="deployment test" className="float-right" src={usdcSvg}></Image></button>
              {/* Currencies dropdown button */}
              <CurrenciesButton currenciesDropdownPopoverShow = {currenciesDropdownPopoverShow}
                                closeCurrenciesDropdownPopover = {closeCurrenciesDropdownPopover}
                                openCurrenciesDropdownPopover = {openCurrenciesDropdownPopover}
                                dropDownSvg = {dropDownSvg}
                                imageStyle = {imageStyle} />
              {/* Currencies dropdown button */}
              {/* Settings dropdown */}
              <SettingsPopover settingsPopoverDropdownRef = {settingsPopoverDropdownRef}
                               settingsDropdownPopoverShow = {settingsDropdownPopoverShow}
                               color = {color}
                               backgroundColor = {backgroundColor}
                               backgroundColor1 = {backgroundColor1}
                               amountInInputWidth = {amountInInputWidth} />

              {/* Settings dropdown */}
            </div>
            <div className="flex justify-center items-center w-5/6 h-2/6 rounded-2xl" style={{ backgroundColor }}>
              <input className="w-2/3 h-2/3 text-4xl text-white p-4 focus:outline-0" style={{ backgroundColor }} defaultValue={expectedAmount} type="number" min="0" onChange={e => { }}></input>
              <button className="w-1/6 h-1/2"><Image alt="deployment test" className="float-right" src={usdcSvg}></Image></button>
              {/* TradeInfoButton */}

              {/* <TradeInfoButton additionalTradeInfoDropdownPopoverShow = {additionalTradeInfoDropdownPopoverShow}
                               closeAdditionalTradeInfoDropdownPopover = {closeAdditionalTradeInfoDropdownPopover}
                               openAdditionalTradeInfoDropdownPopover = {openAdditionalTradeInfoDropdownPopover} /> */}
              
              <button className="w-1/6 h-1/9" onClick={() => {
                additionalTradeInfoDropdownPopoverShow
                  ? closeAdditionalTradeInfoDropdownPopover()
                  : openAdditionalTradeInfoDropdownPopover();
                  
              }}>
                {/* information indicator */}
                <InformationIndicator informationIndicatorWhite = {informationIndicatorWhite}
                                      transactionStatus = {transactionStatus}
                                      transactionStatusDefault = {TransationStatus.DEFAULT}/>
                
                {/* loading indicator */}
                <LoadingIndicator transactionStatus = {transactionStatus} 
                                  transactionStatusLoading = {TransationStatus.LOADING}/>
                {/* success indicator */}
                <SuccessIndicator successIndicator = {successIndicator}
                                  transactionStatus = {transactionStatus}
                                  transactionStatusSuccess = {TransationStatus.SUCCESS}/>
                {/* error indicator */}
                <ErrorIndicator errorIndicator = {errorIndicator} 
                                transactionStatus = {transactionStatus}
                                tranasctionStatusError = {TransationStatus.ERROR}/>
              </button>
              {/* TradeInfoButton */}

              {/* Currencies dropdown */}
              <CurrenciesPopover currenciesPopoverDropdownRef = {currenciesPopoverDropdownRef}
                                 currenciesDropdownPopoverShow = {currenciesDropdownPopoverShow}
                                 amountInInputWidth = {amountInInputWidth}
                                 closeCurrenciesDropdownPopover = {closeCurrenciesDropdownPopover}
                                 usdcDarkSvg = {usdcDarkSvg} />
              {/* Currencies dropdown */}
              {/* Additional trade info dropdown */}
              <AdditionalTradeInformationPopover additionalTradeInfoPopoverDropdownRef = {additionalTradeInfoPopoverDropdownRef}
                                                 additionalTradeInfoDropdownPopoverShow = {additionalTradeInfoDropdownPopoverShow} 
                                                 amountInInputWidth = {amountInInputWidth}
                                                 amountInInputHeight = {amountInInputHeight}
                                                 closeAdditionalTradeInfoDropdownPopover = {closeAdditionalTradeInfoDropdownPopover}
                                                 expectedAmount = {expectedAmount} />
            </div>
            {/* Exchange button */}
            <ExchangeButton determineButtonAction = {determineButtonAction}
                            determineButtonValue = {determineButtonValue} />
            {/* Exchange button */}
          </div>
        </div>
        {/* Stats */}
        <Stats statsSvg={statsSvg}/>
      </div>
      {/* Roadmap & Stats as a footer ( mobile ) */}
      <RoadmapAndStatsMobile statsSvg={statsSvg}
                             imageStyle={imageStyle}
                             roadmapSvg = {roadmapSvg}/>
      {/* Roadmap & Stats as a footer ( mobile ) */}
    </div>
  )
}
