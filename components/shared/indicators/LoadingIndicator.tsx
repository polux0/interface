{/* <span className="loader float-left 2xl:ml-4	xl:ml-4 lg:ml-3.5 md:ml-2.5 sm:ml-2 xsm:ml-0.5 h-9 w-9" style={{display: transactionStatus === TransationStatus.LOADING ? "block" : "none"}}></span> */}

export default function LoadingIndicator({...props}){
    return(
        <span className="loader float-left 2xl:ml-4	xl:ml-4 lg:ml-3.5 md:ml-2.5 sm:ml-2 xsm:ml-0.5 h-9 w-9" style={{display: props.transactionStatus === props.transactionStatusLoading ? "block" : "none"}}></span>
    )
}