import * as express from 'express';
/////////////////////////////////////////
import IController from '../interfaces/IController';
import IUser from '../interfaces/IUser';
import IPost from '../interfaces/IPost';
/////////////////////////////////////////
import userModel from '../models/User';
import postModel from '../models/Post';
/////////////////////////////////////////
import SomethingWentWrongException from '../exceptions/SomethingWentWrongException';
import UserWithThatEmailAlreadyExistsException from './../exceptions/UserWithThatEmailAlreadyExistsException';
////////////////////////////////////////
import validationMiddleware from '../middlewares/validationMiddleware'
import Response from './../services/Response';
import authMiddleware from '../middlewares/auth';
/////////////////////////////////////////
import PostDTO from '../dto/PostDTO';
import IRequestWithUser from './../interfaces/httpRequest/IRequestWithUser';

class PostController implements IController{
    public path: string;
    public router: express.IRouter;
    constructor() {
        this.path = '/Posts';
        this.router = express.Router();
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.get(`${this.path}/getAllPosts`,this.getAllPosts);
        this.router.get(`${this.path}/:ID`,this.getPost);
        ///////////////////////////////////////////////////////////////////////
        this.router.post(`${this.path}`,authMiddleware, validationMiddleware(PostDTO),this.createPost);
    }
    private getAllPosts = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        await postModel.find((err:any,posts:IPost[])=>{
            if(err){
                next(new SomethingWentWrongException());
            }
            else{
                response.status(200).send(new Response(undefined,{ posts }).getData());
            }
        });    
    }
    private getPost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const _id = request.params.ID;
        await postModel.findById(_id,'-__v',(err:any,post:IPost)=>{
            if(err){
                next(new SomethingWentWrongException());
            }
            else{
                response.status(200).send(new Response(undefined,{ post }).getData());
            }
        });    
    }
    private createPost = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
        const Post:PostDTO = request.body;
        await postModel.create({...Post,userID: request.user._id },(err:any,post:IPost)=>{
            if(err){
                next(new SomethingWentWrongException());
            }
            else{
                response.status(201).send(new Response("Created Post Successfully",undefined).getData());
            }
        })    
    }
}
export default PostController;