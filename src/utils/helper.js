export const generateString=(length=6)=>{
    const characters ='0123456789';
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export const mailMessages=(token)=>{
    return `<p>Whatsapp OTP Code: <b>${token}</b></p>`
}

export const checkIfSocketIdExist = (arr,value)=>{
    const data = arr.filter((item)=> item.socketId===value)
    if(data.length>0)
        return true
    else
        return false
}