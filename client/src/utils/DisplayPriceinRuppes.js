export const PriceInruppees =  (price)=>{
    return new Intl.NumberFormat('en-in',{
        style:"currency",
        currency:"INR"
    }).format(price)
}