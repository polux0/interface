import Image from 'next/image';

export default function Stats({...props}){
    return(
        <div className="w-4/12 float-right hover:cursor-pointer xsm:hidden sm:block md:block lg:block xl:block 2xl:block">
        <Image alt="deployment test" className="float-right" src={props.statsSvg}></Image>
      </div>
    )
}