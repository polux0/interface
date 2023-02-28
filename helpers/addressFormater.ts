function addSpace(str: any) {
    return str.split('').join('    ');
}
export function addressFormater(address: string){
    const firstPart = address? addSpace(address?.slice(0, 4)) || "" : ""
    const threeDots = address? " ... " : ""
    const secondPart = address ? addSpace(address?.slice(address?.length - 3, address?.length)) : ""
    return firstPart + threeDots + secondPart || ""
}
