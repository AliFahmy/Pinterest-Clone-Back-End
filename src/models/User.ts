import * as mongoose from 'mongoose';
import IUser from '../interfaces/IUser';

const userSchema = new mongoose.Schema({
  name:{
      type:String,
      required:true
  },
  birthDate:{
    type:Date,
    required:true
  },
  email:{
      type: String,
      required: true
  },
  password: {
    type:String,
    required:true
  },
  profilePicture:{
    type:String,
    required:true
  },
  followers:{
    type:Number,
    default:0
  }
});
 
const userModel = mongoose.model<IUser>('User', userSchema);
 
export default userModel;