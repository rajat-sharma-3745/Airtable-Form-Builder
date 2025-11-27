import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  airtableUserId: String,
  name: String,
  email: String,
 accessToken: String,
  refreshToken: String,
},{timestamps:true});

export default mongoose.model("User", UserSchema);
