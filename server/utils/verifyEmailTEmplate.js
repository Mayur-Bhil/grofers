const verificatioEmailTemplate = ({name,url})=>{
    return `
    <p>Dear ${name} </p>    
    <p> Thank you for registering on Grofers</p>    
        <a href=${url} style="color:white;background:green;margin-top:10px;padding:10px;display:block;border-radius:8px"> Verify Email </a>
    `
}

export default verificatioEmailTemplate;