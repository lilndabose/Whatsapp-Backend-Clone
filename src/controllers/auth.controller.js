import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import * as userService from '../services/user.service.js'
import { SENDMAIL } from "../utils/sendmail.js";
import { generateString,mailMessages } from "../utils/helper.js";
import { getOneToken,createToken } from "../services/token.service.js";
import { config } from "../config/app.config.js";


export const confirmAccount= async(req,res)=>{
    const { token,email } = req.body
    const result = await getOneToken({token})
    if(!result || result.email!=email)  return res.status(500).json({ error: 'Invalid OTP code' });
    
    let user = await userService.getUserByEmail(email)
    user = await userService.updateUser(user.id,{verified: true})

    if(user)  return res.status(200).json({status:'success',message:"OTP Code Verified Successfully !!!" });

    return res.status(500).json({ error: 'An error occured while trying to confrim account try again' });
}

export const resendOtpCode = async (req,res)=>{
    const { email } = req.body
    let token = ''
    let isTokenExist = true
    do{
        token = generateString(4)
        const result = await getOneToken({token})
        if(!result) 
            isTokenExist = false

    }while(isTokenExist)

    const isSave = await createToken({token,email})
    if(isSave){
        const msg = {
            to:email,
            subject: "Realize Whatsapp Clone OTP",
            content: mailMessages(token),
            html: true
        }

        SENDMAIL(msg,(info)=>{
            if(info.messageId){
                return res.status(200).json({data: {token}, status:'success',message:`Token Send to ${email} successfully !!!` });
            }else{
                return res.status(500).json({ error: 'An error occured while sending OTP' });
            }
        })
    }else{
        return res.status(500).json({ error: "Sorry couldn't send OTP" });
    }

}