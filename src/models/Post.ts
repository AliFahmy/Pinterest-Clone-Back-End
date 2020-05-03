import * as mongoose from 'mongoose';
import IPost from '../interfaces/IPost';
const postSchema = new mongoose.Schema({
  picture:{
      type:String,
      required:true
  },
  likes:{
      type:Number,
      default:0
  },
  title:{
      type:String,
      required:true
  },
  caption:{
      type:String,
      required:true
  },
  userID:{
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
    required:true
  }
});
 
const postModel = mongoose.model<IPost>('Post', postSchema);
 
export default postModel;