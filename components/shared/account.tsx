import Image from 'next/image';


{/* <div className="col-start-7 text-white hover:cursor-pointer xsm:hidden sm:block md:block lg:block xl:block 2xl:block mt-1.5" onClick={determineAccountAction()}>
    <h1 className="mb-3.5 mr-px float-left" style={{display: mounted ? "block": "none"}}>
    {determineAccountValue()}
    </h1>
    <Image className={"mt-2 ml-2"} alt="deployment test" src={accountModalOpenIndicator}></Image>
</div> */}
export default function Account({...props}){
    return (
        <div className="col-start-7 text-white hover:cursor-pointer xsm:hidden sm:block md:block lg:block xl:block 2xl:block mt-1.5" onClick={props.determineAccountAction()}>
          <h1 className="mb-3.5 mr-px float-left" style={{display: props.mounted ? "block": "none"}}>{props.determineAccountValue()}</h1>
          <Image className={"mt-2 ml-2"} alt="deployment test" src={props.accountModalOpenIndicator}></Image>
        </div>
    )
}