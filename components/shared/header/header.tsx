
import Account from '../account';
import AccountMobile from './accountMobile';
import Logo from './logo';


// {/* <div className="grid 2xl:grid-cols-7 xl:grid-cols-7 lg:grid-cols-7 md:grid-cols-7 sm:grid-cols-5">
// {/* Logo */}
// <Logo agencyLogoSvg = {agencyLogoSvg}/>
// {/* Logo */}
// <Account determineAccountAction = {determineAccountAction} 
//          mounted = {mounted} 
//          determineAccountValue = {determineAccountValue} 
//          accountModalOpenIndicator = {accountModalOpenIndicator}
// />
// {/* Account indicator for mobile screen */}
// <AccountMobile userWalletMobileScreen = {userWalletMobileScreenSvg}/>
// {/* Account indicator for mobile screen */}
// </div> */}

export default function Header({...props}){
    return(
    <div className="grid 2xl:grid-cols-7 xl:grid-cols-7 lg:grid-cols-7 md:grid-cols-7 sm:grid-cols-5">
        <Logo agencyLogoSvg = {props.agencyLogoSvg}/>
        {/* Logo */}
        <Account determineAccountAction = {props.determineAccountAction} 
                 mounted = {props.mounted} 
                 determineAccountValue = {props.determineAccountValue} 
                 accountModalOpenIndicator = {props.accountModalOpenIndicator}
        />
        {/* Account indicator for mobile screen */}
        <AccountMobile userWalletMobileScreen = {props.userWalletMobileScreenSvg}/>
    </div>
    )

}