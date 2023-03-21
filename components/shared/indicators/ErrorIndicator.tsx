import Image from 'next/image';

{/* <Image className="error" alt="deployment test" src={errorIndicator} style={{display: transactionStatus === TransationStatus.ERROR ? "block" : "none", marginLeft: "auto", marginRight: "auto"}}></Image> */}

export default function ErrorIndicator({...props}){
    return(
        <Image className="error" alt="deployment test" src={props.errorIndicator} style={{display: props.transactionStatus === props.tranasctionStatusError ? "block" : "none", marginLeft: "auto", marginRight: "auto"}}></Image>
        )
}