import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers
        if (!token) {
            return res.json({ success: false, message: "Not Authorized Please Login again" })
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        
        // Check if user exists and is admin
        const user = await userModel.findById(token_decode.id)
        if (!user || !user.isAdmin) {
            return res.json({ success: false, message: "Not Authorized Please Login again" })
        }
        
        req.body.userId = token_decode.id
        next()

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

export default adminAuth