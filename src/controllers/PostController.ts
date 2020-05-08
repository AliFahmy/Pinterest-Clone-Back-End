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
////////////////////////////////////////
import validationMiddleware from '../middlewares/validationMiddleware'
import Response from './../services/Response';
import authMiddleware from '../middlewares/auth';
/////////////////////////////////////////
import PostDTO from '../dto/PostDTO';
import IRequestWithUser from './../interfaces/httpRequest/IRequestWithUser';
import * as mongoose from 'mongoose';
class PostController implements IController{
    private NUMBER_OF_POSTS_PER_PAGE:number;
    public path: string;
    public router: express.IRouter;
    constructor() {
        this.path = '/Posts';
        this.router = express.Router();
        this.initializeRoutes();
        this.NUMBER_OF_POSTS_PER_PAGE=20;
    }
    private initializeRoutes() {
        this.router.get(`${this.path}/mostLikedPosts`,this.getMostLikedPosts);
        this.router.get(`${this.path}/getAllPosts/:page/:userID?`,this.getAllPosts);
        this.router.get(`${this.path}/:ID`,this.getPost);
        ///////////////////////////////////////////////////////////////////////
        this.router.post(`${this.path}`,authMiddleware, validationMiddleware(PostDTO),this.createPost);
    }
    private getMostLikedPosts = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        await postModel
        .find({},'-__v')
        .sort({likes:'desc'})
        .limit(5)
        .then(async (posts:IPost[])=>{
            response.status(200).send(new Response(undefined,{ posts }).getData());
            })
        .catch(err=>{
            next(new SomethingWentWrongException(err));
        }); 
    }
    private getAllPosts = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const page:number = parseInt(request.params.page);
        const ID:string = request.params.userID;
        await postModel
        .find(ID ? {userID: ID }:{},'-__v')
        .skip((page-1)*this.NUMBER_OF_POSTS_PER_PAGE)
        .limit(this.NUMBER_OF_POSTS_PER_PAGE)
        .then(async (posts:IPost[])=>{
            await postModel
            .countDocuments(ID ? {userID:ID}:{})
            .then((number:number)=>{
                response.status(200).send(new Response(undefined,{ posts,pages:Math.ceil(number/this.NUMBER_OF_POSTS_PER_PAGE )}).getData());
            }).catch(err=>{
                next(new SomethingWentWrongException(err));
            })
        })
        .catch(err=>{
            next(new SomethingWentWrongException(err));
        }); 
    }
    private getPost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const _id = request.params.ID;
        await postModel.findById(_id,'-__v',(err:any,post:IPost)=>{
            if(err){
                next(new SomethingWentWrongException(err));
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
                next(new SomethingWentWrongException(err));
            }
            else{
                response.status(201).send(new Response("Created Post Successfully",undefined).getData());
            }
        })    
    }
}
export default PostController;