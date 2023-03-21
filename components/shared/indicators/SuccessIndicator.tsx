import Image from 'next/image';

{/* <Image className="success" alt="deployment test" src={successIndicator} style={{display: transactionStatus === TransationStatus.SUCCESS ? "block" : "none", marginLeft: "auto", marginRight: "auto"}}></Image> */}

export default function SuccessIndicator({...props}){
    return(
        <Image className="success" alt="deployment test" src={props.successIndicator} style={{display: props.transactionStatus === props.transactionStatusSuccess ? "block" : "none", marginLeft: "auto", marginRight: "auto"}}></Image>
        )
}