import { Document} from "mongoose";
interface IUser extends Document{
    _id: string;
    name:string
    email: string;
    password: string;
    birthDate: Date;
}
export default IUser;