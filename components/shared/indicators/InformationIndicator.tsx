import Image from 'next/image';

{/* <Image className="hidden" alt="deployment test" src={informationIndicatorWhite} style={{display: transactionStatus === TransationStatus.DEFAULT ? "block" : "none", marginLeft: "auto", marginRight: "auto"}}></Image> */}

export default function InformationIndicator({...props}){
    return(
        <Image className="hidden" alt="deployment test" src={props.informationIndicatorWhite} style={{display: props.transactionStatus === props.transactionStatusDefault ? "block" : "none", marginLeft: "auto", marginRight: "auto"}}></Image>

    )
}