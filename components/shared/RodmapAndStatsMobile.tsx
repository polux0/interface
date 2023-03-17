{/* <div className="w-full h-1/7 mt-3 2xl:hidden xl:hidden lg:hidden md:hidden sm:hidden">
<div className="w-4/12 float-right hover:cursor-pointer">
  <Image alt="deployment test" className="" src={statsSvg} style={imageStyle}></Image>
</div>
<div className="w-4/12 float-left hover:cursor-pointer">
  <Image alt="deployment test" className="" src={roadmapSvg}></Image>
</div>
</div> */}
import Image from 'next/image';


// Roadmap and stats as footer ( for mobile )
export default function RoadmapAndStatsMobile({...props}){
    return(
        <div className="w-full h-1/7 mt-3 2xl:hidden xl:hidden lg:hidden md:hidden sm:hidden">
            <div className="w-4/12 float-right hover:cursor-pointer">
                <Image alt="deployment test" src={props.statsSvg} style={props.imageStyle}></Image>
            </div>
            <div className="w-4/12 float-left hover:cursor-pointer">
                <Image alt="deployment test" src={props.roadmapSvg}></Image>
            </div>
        </div>
    );
}