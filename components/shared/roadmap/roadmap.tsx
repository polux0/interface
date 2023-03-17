import Image from 'next/image';

{/* <div className="float-left w-4/12 xsm:hidden 2xl:block xl:block lg:block md:block sm:block">
    <button><Image src={roadmapSvg} alt="deployment test" style={imageStyle}></Image></button>
</div> */}

export default function Roadmap({...props}){
    return(
    <div className="float-left w-4/12 xsm:hidden 2xl:block xl:block lg:block md:block sm:block">
        <button>
            <Image src={props.roadmapSvg} alt="deployment test" style={props.imageStyle}></Image>
        </button>
    </div>
    );
}