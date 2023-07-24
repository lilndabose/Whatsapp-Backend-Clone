import express from 'express'
import { confirmAccount,resendOtpCode } from '../controllers/auth.controller.js'
import { userExist } from '../middleware/userExist.js'

const router = express.Router()

router.route("/verify-account").post(userExist,confirmAccount)
router.route("/resend-code").post(userExist,resendOtpCode)


export default router