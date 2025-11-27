import jwt from 'jsonwebtoken'
export const getBase64 = (file) => {
    return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
}

export const sendToken = (res,user,code,message) => {
   const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
   const userWithoutPassword = user.toObject();
   delete userWithoutPassword.password;
   return res.status(code).cookie('token',token,{
    httpOnly:true,
    secure:true,
    sameSite:"none",
    maxAge:15*24*60*1000
   }).json({
      success:true,
      message,user:userWithoutPassword
   })

}