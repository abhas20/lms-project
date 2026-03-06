import express from "express"
import {googleSignup, login, logOut, resetPassword, sendOtp, signUp, verifyOtp } from "../controllers/authController.js"

const authRouter = express.Router()

authRouter.post("/signup",signUp)

authRouter.post("/login",login)
authRouter.get("/logout",logOut)
authRouter.post("/googlesignup",googleSignup)
authRouter.post("/sendotp",sendOtp)
authRouter.post("/verifyotp",verifyOtp)
authRouter.post("/resetpassword",resetPassword)

authRouter.get("/sso-token", (req, res) => {

  const token = req.cookies.token;

  console.log("🔐 Cookie token:", token);

  if (!token) {
    return res.status(401).json({ error: "Not logged in" });
  }

  res.json({ token });

});
export default authRouter