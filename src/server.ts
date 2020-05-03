import * as express from 'express';
import * as dotenv from 'dotenv';
import App from './app';
import UserController from './controllers/UserController';
import PostController from './controllers/PostController';
dotenv.config();

const app = new App([new UserController(),new PostController()]);

app.listen();