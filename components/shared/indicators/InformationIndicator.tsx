import Image from 'next/image';

export default function InformationIndicator({...props}){
    return(
        <Image className="hidden" alt="deployment test" src={informationIndicatorWhite} style={{display: transactionStatus === TransationStatus.DEFAULT ? "block" : "none", marginLeft: "auto", marginRight: "auto"}}></Image>

    )
}