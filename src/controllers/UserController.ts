import * as bcrypt from 'bcrypt';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
/////////////////////////////////////////
import IController from '../interfaces/IController';
import IUser from '../interfaces/IUser';
/////////////////////////////////////////
import userModel from '../models/User';
/////////////////////////////////////////
import SomethingWentWrongException from '../exceptions/SomethingWentWrongException';
import WrongCredentialsException from './../exceptions/WrongCredentialsException';
import UserWithThatEmailAlreadyExistsException from './../exceptions/UserWithThatEmailAlreadyExistsException';
/////////////////////////////////////////
import LoginDTO from '../dto/LoginDTO';
////////////////////////////////////////
import validationMiddleware from '../middlewares/validationMiddleware'
import Response from './../services/Response';
import RegisterDTO from './../dto/RegisterDTO';
class UserController implements IController {
    public path: string;
    public router: express.IRouter;
    constructor() {
        this.path = '/User';
        this.router = express.Router();
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.get(`${this.path}/:ID`,this.getUser);
        /////////////////////////////////////////////////////////////////////////////////
        this.router.post(`${this.path}/Login`,validationMiddleware(LoginDTO),this.login);
        this.router.post(`${this.path}/Register`,validationMiddleware(RegisterDTO),this.register);
    }
    private login = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const logInData: LoginDTO = request.body;
        const user = await userModel.findOne({ email: logInData.email });
        if (user) {
            const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
            if (isPasswordMatching) {
                user.password = undefined;
                const token =  jwt.sign({_id:user._id},process.env.JWT_SECRET)
                response.status(200).send(new Response('Login success', { token }).getData());
            }
            else {
                next(new WrongCredentialsException());
            }
        }
        else {
            next(new WrongCredentialsException());
        }
    }
    private register = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const userData: RegisterDTO = request.body;
        if (await userModel.findOne({ email: userData.email })) {
            next(new UserWithThatEmailAlreadyExistsException(userData.email));
        }
        else {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            try {
                await userModel.create({
                    ...userData,
                    password: hashedPassword,
                }, (err: any, user: IUser) => {
                    if (err) {
                        next(new SomethingWentWrongException(err));
                    }
                    else {
                        user.password = undefined;
                        const token =  jwt.sign({_id:user._id},process.env.JWT_SECRET)
                        response.status(201).send(new Response('Registered successfully', { token }).getData());        
                    }
                });
            }
            catch(err){
                next(new SomethingWentWrongException(err));
            }
        }
    }
    private getUser = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const _id = request.params.ID;
        await userModel.findById(_id,'-password  -__v',(err,user:IUser)=>{
            if(err){
                next(new SomethingWentWrongException(err));
            }
            else{
                response.status(200).send(new Response(undefined, { user }).getData());
            }
        })
    }
}
export default UserController;
