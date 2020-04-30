import * as express from 'express';
import * as dotenv from 'dotenv';
import App from './app';
import UserController from './controllers/UserController';
dotenv.config();

const app = new App([new UserController()]);
app.listen();