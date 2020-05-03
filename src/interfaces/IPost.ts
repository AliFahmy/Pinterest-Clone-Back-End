import { Document} from "mongoose";
interface IPost extends Document{
    _id: string;
    picture:string;
    likes:number;
    title:string;
    caption:string;
    userID:string;
}
export default IPost;