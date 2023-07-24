import * as userService from "../services/user.service.js";
import { generateString, mailMessages } from "../utils/helper.js";
import { getOneToken,createToken } from "../services/token.service.js";
import { SENDMAIL } from "../utils/sendmail.js";


export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    const usersList = users.filter((item)=> item.verified===true);
    res.json({ data: usersList, status: "success", message: 'Fetch users successfully !!!' }).status(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
      let token = ''
      let isTokenExist = true
      do {
        token = generateString(4)
        const result = await getOneToken({token})
        if (!result)
          isTokenExist = false
      } while (isTokenExist)

      const saveToken = await createToken({ token, email: req.body.email })

      const usersList = await userService.getAllUsers();
      const isFound = usersList.some(item => item.email === req.body.email)
     
      let user = null
      if(!isFound){
        user = await userService.createUser(req.body)
      }else{
        return res.status(400).json({ error: 'Sorry user with email '+req.body.email+" already found in database" });
      }
      
      if(saveToken){
          const msg = {
              to: req.body.email,
              subject: "Realize Whatsapp Clone OTP",
              content: mailMessages(token),
              html: true
          }

          SENDMAIL(msg,(info)=>{
              if(info.messageId){
                return res.json({ data: user, status: "success", message: 'Account created Check mail to confirm email' }).status(201);
              }else{
                  return res.status(500).json({ error: 'An error occured while sending mail' });
              }
          })
      }

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (user !== null) return res.json({ data: user, status: "success", message: 'User found !!!' }).status(200);

    return res.json({ data: user, status: "success", message: `No user found with id: ${id}` }).status(401);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    let user = await userService.updateUser(req.params.id, req.body);
    if (user !== null) {
      user = await userService.getUserById(req.params.id)
    }
    res.json({ data: user, status: "success" }).status(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    res.json({ data: user, status: "success" }).status(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};