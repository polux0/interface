import Image from 'next/image';

{/* <div className="col-start-6 text-white place-self-center sm:place-self-center sm:mb-3.5 xsm:mb-3.5 hover:cursor-pointer xsm:block sm:hidden md:hidden lg:hidden xl:hidden 2xl:hidden">
<Image alt="deployment test" className="mb-1" src={userWalletMobileScreenSvg}></Image>
</div> */}
export default function AccountMobile({...props}){
    return (
        <div className="col-start-6 text-white place-self-center sm:place-self-center sm:mb-3.5 xsm:mb-3.5 hover:cursor-pointer xsm:block sm:hidden md:hidden lg:hidden xl:hidden 2xl:hidden">
        <Image alt="deployment test" className="mb-1" src={props.userWalletMobileScreen}></Image>
      </div>
    )
}