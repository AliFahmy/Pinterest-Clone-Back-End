import { Request } from 'express';
import IUser from '../IUser';
 
interface IRequestWithUser extends Request {
  user: IUser;
}
 
export default IRequestWithUser;