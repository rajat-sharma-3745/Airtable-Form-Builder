import jwt from 'jsonwebtoken'


export const sendToken = (res,user,code,message,url) => {
   const token = jwt.sign({id:user._id},process.env.JWT_SECRET, { expiresIn: "7d" });

   return res.status(code).cookie('token',token,{
    httpOnly:true,
    secure:true,
    sameSite:"none",
    maxAge:7*24*60*1000
   }).json({
      success:true,
      message,user,url
   })

}