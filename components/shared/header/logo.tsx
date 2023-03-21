import Image from 'next/image';

{/* <div className="2xl:col-start-3 col-span-2 2xl:place-self-center xl:col-start-3 col-span-2 xl:place-self-center lg:col-start-3 col-span-3 lg:place-self-center md:col-start-3 col-span-2 md:place-self-center sm:col-start-2 col-span-3 sm:place-self-end xsm: col-start-2 place-self-center">
    <Image alt="deployment test" className="2xl:ml-0 xl:ml-0 md:ml-0 sm:ml-20" src={agencyLogoSvg}></Image>
</div> */}

export default function Logo({...props}){
    
    return (
        <div className="2xl:col-start-3 col-span-2 2xl:place-self-center xl:col-start-3 col-span-2 xl:place-self-center lg:col-start-3 col-span-3 lg:place-self-center md:col-start-3 col-span-2 md:place-self-center sm:col-start-2 col-span-3 sm:place-self-end xsm: col-start-2 place-self-center">
        <Image alt="deployment test" className="2xl:ml-0 xl:ml-0 md:ml-0 sm:ml-20" src={props.agencyLogoSvg}></Image>
      </div>
    )
}
