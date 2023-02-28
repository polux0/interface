import ExchangeButton from './exchangebutton'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from "react";
import { ethers } from 'ethers';
import { useAccount, useBalance, useContractRead, useContractWrite, usePrepareContractWrite, useProvider, useWaitForTransaction } from 'wagmi'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { agencyStableAbi, agencyUsdcAmmRouterAbi, agencyTreasurySeedAbi } from '../../contracts/abis'
import useDebounce from '../../hooks/Debounce';
import { BigNumber } from 'ethers';
import Image from 'next/image';


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
import {useIsMounted} from "../../helpers/useIsMounted"
import React from "react";
import { createPopper } from "@popperjs/core";

import {
    useConnectModal,
    useAccountModal,
    useChainModal,
  } from '@rainbow-me/rainbowkit';
import { addressFormater } from '@/helpers/addressFormater';
import enoughStables from '@/helpers/validation';

export default function Exchange({...props}){

    const { openConnectModal } = useConnectModal();
    const { openAccountModal } = useAccountModal();
    const { openChainModal } = useChainModal();
    const mounted = useIsMounted();

    const { address, isConnecting, isDisconnected } = useAccount()
    
    const addressFormated = addressFormater(address || "");

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
    const exchangeContainerHeight = {height: "500px"};
    const color = "white";
    const backgroundColor1 = "yellow";
    const dynamicallMargin = {
        marginTop: "calc(100vh / 7)"
    }
  // const alignWithExchangeModal: ( screenWidth - exchangeModalWidth) / 2 = 375.5
  // const differenceBetweenExchangeModalAndLogoWidth:  ExchangeModalWidth - logoWidth = 572 - 289 = 283 / 2 ( to be centered ) = 141.5
  // const FinalMargin: alignWithExchangeModal+differenceBetweenExchangeModalAndLogoWidth
    
  
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

    // technical debt
    // 2. create config for contracts ( hooks )
    const account = useAccount();
    const provider = useProvider();


    const [ amount, setAmount ] = useState("0");
    const [ amountWei, setAmountWei ] = useState("0");
    const [ currentAllowance, setCurrentAllowance ] = useState("0");
    const [ expectedAmount, setExpectedAmount ] = useState("0");
    // const [ currentAllowanceIncreased, setCurrentAllowanceIncreased] = useState(false);

    const debouncedInputAmount = useDebounce(amount, 800);

    // technical debt 
    // user should set it's `deadline` as well as `slippage`

    let currentAllowanceNormalized;
    let amountWeiNormalized;
    let amountMinOutWeiValue;
    try {
         currentAllowanceNormalized = ethers.utils.parseUnits(currentAllowance.toString(), "ether").toString();
         amountWeiNormalized = ethers.utils.parseUnits(amountWei.toString(), "ether").toString();
         amountMinOutWeiValue = BigNumber.from(amountWei).sub(BigNumber.from(amountWei).div(10));
    } catch (error) {
        currentAllowanceNormalized = "0";
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
        args:[account.address, "0xb08a51B76A5c00827336903598Dce825912bDeCc"],
        enabled: false,
    })
    // fetch quote ( done )
    const { refetch: fetchQuote } = useContractRead({
        address: '0xb08a51B76A5c00827336903598Dce825912bDeCc',
        abi: agencyTreasurySeedAbi,
        functionName: 'getSeedQuote',
        args:[amountWei],
        enabled: false,
    })
    // increase allowance ( account.address <> treasurySeedContract.address ) ( done )
    const { config: increaseAllowanceConfig } = usePrepareContractWrite({
        address: '0xD7295ab92c0BAe514dC33aB9Dd142f7d10AC413b',
        abi: agencyStableAbi,
        functionName: 'increaseAllowance',
        args: ["0x5c41C8AF1C022ECadf1C309F8CCA489A93077a8b", amountWeiNormalized],
    })
    // treasurySeed ( done )
    const { config: swapExactFraxForTempleConfig } = usePrepareContractWrite({
        address: '0xb08a51B76A5c00827336903598Dce825912bDeCc',
        abi: agencyTreasurySeedAbi,
        functionName: 'seed',
        args: [amountWeiNormalized],
        // not sure if necessary
        overrides: {gasLimit: BigNumber.from(600000)}
    })
    // config of contractWrite 
    const { write: increaseAllowanceWrite, data: increaseAllowanceData, error: increaseAllowanceError, isLoading: increaseAllowanceIsLoading, isError: increaseAllowanceIsError, isSuccess: increaseAllowanceIsSuccess } = useContractWrite(increaseAllowanceConfig)
    const { write: swapExactFraxForTempleWrite, data: swapExactFraxForTempleWriteData, error: swapExactFraxForTempleWriteError, isLoading: swapExactFraxForTempleWriteIsLoading, isError: swapExactFraxForTempleWriteIsError, isSuccess: swapExactFraxForTempleWriteIsSuccess } = useContractWrite(swapExactFraxForTempleConfig)

    if(increaseAllowanceError){
        console.log('Error with `usePrepareContractWriteIncreaseAllowance`: ', increaseAllowanceError)
    }
    if(swapExactFraxForTempleWriteError){
        console.log('Error with `usePrepareContractWriteswapExactFraxForTempleWrite`: ', swapExactFraxForTempleWriteError)
    }
    const increaseAllowanceOrSwap = function(){
        // technical debt
        // question: should we put `currentAllowanceNormalized` && `amountNormalized` as part of state
        let currentAllowanceNormalized;
        try {
            currentAllowanceNormalized = BigNumber.from(currentAllowance).toString();    
        } catch (error) {
            currentAllowanceNormalized = "0";
        }
        
        const amountNormalized = ethers.utils.parseEther(amount).toString()
        const isCurrentAllowanceGreaterOrEqualToAmount = (BigNumber.from(currentAllowanceNormalized)).gte(BigNumber.from(amountNormalized));
        return isCurrentAllowanceGreaterOrEqualToAmount ? "Swap" : "Increase allowance";
    }
    function test(){
        console.log("swap will fail")
    }
    useWaitForTransaction({
        confirmations: 1,
        hash: increaseAllowanceData?.hash,
        onSettled(data, error) {
            console.log('Settled', { data, error })
            fetchAllowance?.().then(increaseAllowancePromise =>{
                const updatedAllowance = increaseAllowancePromise?.data as string
                setCurrentAllowance(updatedAllowance);
            })
          },
      });

    const increaseAllowanceOrSwapWrite = function(){

        const result = increaseAllowanceOrSwap()
        result === "Swap" ? swapExactFraxForTempleWrite?.() : increaseAllowanceWrite?.();
    }
    useEffect(
        () => {
          if (debouncedInputAmount) {
            fetchAllowance?.().then(currentAllowancePromise =>{
                const result = currentAllowancePromise?.data as string
                setCurrentAllowance(result);
            })
            fetchQuote?.().then(quote => {
                const result = quote?.data as any;
                let amountOutAMM, amountOutProtocol, amountOut;
                try {
                    amountOut = ethers.utils.formatUnits( result, "wei" ) || 0;
                } catch (error) {
                    amountOutAMM = 0
                    amountOutProtocol = 0
                    amountOut = 0
                }
                setExpectedAmount(amountOut.toString())
            });
          } else {
            setCurrentAllowance("0");
            setExpectedAmount("0")
          }
        },
        [debouncedInputAmount, fetchAllowance, fetchQuote, provider] // Only call effect if debounced search term changes
    );
    async function amountHandler(event: any){
        const amount: any = event.target.value;
        let amountWei;
        try {
            amountWei = ethers.utils.formatUnits(amount, "wei");    
        } catch (error) {
            amountWei = "0";
        }
        setAmountWei(amountWei)
        // technical debt
        // should not be here as it violates single responsibillity principle
        setAmount(amountWei);
    }

    // experimenting
    return (
        <div className="h-screen bg-black p-6" style={{backgroundColor}}>
        {/* Header */}
          <div className="grid 2xl:grid-cols-7 xl:grid-cols-7 lg:grid-cols-7 md:grid-cols-7 sm:grid-cols-5">
            <div className="2xl:col-start-3 col-span-2 2xl:place-self-center xl:col-start-3 col-span-2 xl:place-self-center lg:col-start-3 col-span-3 lg:place-self-center md:col-start-3 col-span-2 md:place-self-center sm:col-start-2 col-span-3 sm:place-self-end xsm: col-start-2 place-self-center"><Image alt="deployment test" className="2xl:ml-0 xl:ml-0 md:ml-0 sm:ml-12" src={agencyLogoSvg}></Image></div>
            <div className="col-start-7 text-white place-self-center hover:cursor-pointer xsm:hidden sm:block md:block lg:block xl:block 2xl:block"><h1 className="mb-3.5" onClick={openAccountModal}>
            {mounted ? addressFormated : ""}</h1></div>
            <div className="col-start-6 text-white place-self-center sm:place-self-center sm:mb-3.5 xsm:mb-3.5 hover:cursor-pointer xsm:block sm:hidden md:hidden lg:hidden xl:hidden 2xl:hidden"><Image alt="deployment test" className="mb-1" src={userWalletMobileScreenSvg}></Image></div> 
          </div>
        <div className="flex flex-row w-full min-h-3/4 lg:mt-36 justify-center items-center md:mt-36 sm:mt-36 xsm:mt-1">
        {/* //Roadmap */}
        <div className="float-left w-4/12 xsm:hidden 2xl:block xl:block lg:block md:block sm:block">
          <button><Image src={roadmapSvg} alt="deployment test" style={imageStyle}></Image></button>
        </div>
          <div className="h-max 2xl:w-4/12 xl:w-5/12 lg:w-6/12 bg-white rounded-3xl p-6" style={exchangeContainerHeight}>
            <div className = "w-full h-1/6">
              <button className="float-right" onClick={() => {
                    console.log("height: ", window.innerHeight)
                    console.log("width: ", window.innerWidth)
                    settingsDropdownPopoverShow
                      ? closeSettingsDropdownPopover()
                      : openSettingsDropdownPopover();
                  }}><Image alt="deployment test" src={settingsSvg}></Image></button>
            </div>
            {/* Swap */}
            <div className="flex flex-col justify-center items-center space-y-2 h-2/3"> 
              <div className="flex justify-center items-center w-5/6 h-2/6 rounded-2xl" style={{backgroundColor}}>
                  <input className="w-2/3 h-2/3 text-4xl text-white p-4 focus:outline-0" style={{backgroundColor}} type="number" min="0" value={amount} onChange={e => amountHandler(e)}></input>
                  <button className="w-1/6 h-1/2"><Image alt="deployment test"className="float-right"src={usdcSvg}></Image></button>
                  <button className="w-1/6 h-1/2" onClick={() => {
                    currenciesDropdownPopoverShow
                      ? closeCurrenciesDropdownPopover()
                      : openCurrenciesDropdownPopover();
                  }}
                  ><Image alt="deployment test" src={dropDownSvg} style={imageStyle}></Image></button>
                  {/* Settings dropdown */}
                  <div id="dropdown" ref={settingsPopoverDropdownRef} className={(settingsDropdownPopoverShow ? "block " : "hidden ") + (color === "white" ? "bg-white " : backgroundColor1 + " ") +
                    "absolute text-base z-10 float-right w-1/6 h-2/6 py-2 list-none text-center rounded-2xl border-4 border-black border-solid shadow-lg p-5 mt-40 ml-36"
                  }>
                    <h3 className='text-black'>Slippage tolerance</h3>
                    <div className="flex flex-col h-4/5 py-2 text-sm dark:text-gray-400">
                      <div className="flex justify-center items-center text-center w-6/6 h-1/3 bg-white">
                        <button className="w-1/4 h-full rounded-2xl border-2 border-gray mr-1">
                            Auto
                        </button>
                        <input className="w-3/4 text-2xl text-white text-center p-4 rounded-2xl focus:outline-0" value={"0,5 %"}style={{backgroundColor}}></input>
                      </div>
                      <div className="w-6/6 h-full p-2 bg-white">
                        <div className="w-4/4 text-1xl">
                          Your transaction will revert if the price changes unfavorably by more than this percentage during your order.
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Settings dropdown */}
              </div>
              <div className="flex justify-center items-center w-5/6 h-2/6 rounded-2xl" style={{backgroundColor}}>
                  <input className="w-2/3 h-2/3 text-4xl text-white p-4 focus:outline-0" style={{backgroundColor}} defaultValue={expectedAmount} type="number" min="0" onChange={e => {}}></input>
                  <button className="w-1/6 h-1/2"><Image alt="deployment test" className="float-right" src={usdcSvg}></Image></button>
                  <button className="w-1/6 h-1/9" onClick={() => {
                    additionalTradeInfoDropdownPopoverShow
                      ? closeAdditionalTradeInfoDropdownPopover()
                      : openAdditionalTradeInfoDropdownPopover();
                  }}><Image alt="deployment test" src={informationIndicatorWhite} style={imageStyle}></Image></button>
                  {/* Currencies dropdown */}
                  <div id="dropdown" ref={currenciesPopoverDropdownRef} className={(currenciesDropdownPopoverShow ? "block " : "hidden ") + (color === "white" ? "bg-white " : backgroundColor1 + " ") +
                    "absolute text-base z-10 float-right w-1/6 py-2 list-none text-center rounded-2xl border-4 border-black border-solid shadow-lg mt-40 ml-36"
                  }>
                    <h3 className='text-black'>Choose token</h3>
                    <div className="flex flex-col py-2 text-sm dark:text-gray-400 p-5">
                      <div onClick={()=>{console.log("FRAX"); closeCurrenciesDropdownPopover()}} className="flex justify-center items-center w-6/6 h-1/9 p-2 rounded-2xl border-2 border-gray hover:text-black hover:border-black border-solid mb-2.5 bg-white">
                        <button className="w-1/4"><Image alt="deployment test" src={usdcDarkSvg}></Image></button>
                        <div className="w-3/4 float-left mr-9"> $FRAX </div>
                      </div>
                      <div onClick={()=>{console.log("USDC"); closeCurrenciesDropdownPopover()}} className="flex justify-center items-center w-6/6 h-1/9 p-2 rounded-2xl border-2 border-gray hover:text-black hover:border-black border-solid mb-2.5 bg-white">
                        <button className="w-1/4"><Image alt="deployment test" src={usdcDarkSvg}></Image></button>
                        <div className="w-3/4 float-left mr-9"> $USDC </div>
                      </div>
                      <div onClick={()=>{console.log("USDT"); closeCurrenciesDropdownPopover()}} className="flex justify-center items-center w-6/6 h-1/9 p-2 rounded-2xl border-2 border-gray hover:text-black hover:border-black border-solid mb-2.5 bg-white">
                        <button className="w-1/4"><Image alt="deployment test" src={usdcDarkSvg}></Image></button>
                        <div className="w-3/4 float-left mr-9"> $USDT </div>
                      </div>
                    </div>
                  </div>
                  {/* Currencies dropdown */}
                  {/* Additional trade info dropdown */}
                  <div id="dropdown" ref={additionalTradeInfoPopoverDropdownRef} className={(additionalTradeInfoDropdownPopoverShow ? "block " : "hidden ") + (color === "white" ? "bg-white " : backgroundColor1 + " ") +
                    "absolute text-base z-10 float-right h-2/6 w-1/5 py-2 list-none rounded-2xl border-4 border-black border-solid shadow-lg mx-0	my-0 p-5"
                  }>
                    <div className="flex flex-col space-y-2 py-4 text-sm dark:text-gray-400 p-2">
                      <div className="mb-6">
                        <h3 className="float-left text-lg text-black">More details</h3>
                        <h3 className="float-right text-lg text-black hover:cursor-pointer" onClick={() => {  if(additionalTradeInfoDropdownPopoverShow){closeAdditionalTradeInfoDropdownPopover()}}}>X</h3>
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
                <button className="w-full text-black bg-white h-full rounded-2xl" onClick={isDisconnected? openConnectModal : enoughStables(data?.value.toString(), amountWeiNormalized) ? increaseAllowanceOrSwapWrite : test()}>{ isDisconnected? "Connect wallet" : enoughStables(data?.value.toString(), amountWeiNormalized) ? increaseAllowanceOrSwap(): "Insufficient USDC amount"}</button>
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
function isWalletConnected(connected: boolean){
    return connected ? <ExchangeButton></ExchangeButton> : <ConnectButton></ConnectButton>
}
