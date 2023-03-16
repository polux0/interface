import Image from 'next/image';

export default function Account({...props}){
    return (
        // props:
        // openAccountModal
        // mounted
        // isConnected
        // isChainSupported
        // chain
        // addressFormater
        <div className="col-start-7 text-white hover:cursor-pointer xsm:hidden sm:block md:block lg:block xl:block 2xl:block mt-1.5">
            <h1 className="mb-3.5 mr-px float-left" onClick={props.openAccountModal} style={{display: props.mounted ? props.isConnected && props.isChainSupported(props.chain) ? "block": "none" : "none"}}>
            {props.mounted ? props.addressFormater(props.address ?? "") : ""}
            </h1>
            <Image className={"mt-2 ml-2"} alt="deployment test" src={props.accountModalOpenIndicator} onClick={props.openAccountModal} style={{display: props.mounted ? props.isConnected && props.isChainSupported(props.chain) ? "block": "none" : "none"}}></Image>
            {props.mounted && !props.isChainSupported(props.chain) ? <div className="" onClick={props.openChainModal}>Switch network</div> : <div></div>}
        </div>
    )
}