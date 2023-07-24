import mongoose from "mongoose";
const Schema = mongoose.Schema;
 
const userSchema = new Schema({
  email: String,
  pseudo: String,
  description: String,
  verified:{
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Users", userSchema);