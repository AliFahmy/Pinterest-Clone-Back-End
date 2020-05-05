import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../swagger.json';
import * as cors from 'cors'
import IController from './interfaces/IController';
import errorMiddleware from './middlewares/errorMiddleware';

class App {

  private app : express.Application;
  private PORT:any;
  
  constructor(controllers: IController[]) {
    
    this.app = express();
    this.PORT = process.env.PORT || 5000;

    
    this.initializeMiddlewares();
    
    
    this.initializeControllers(controllers);
    this.connectToDatabase();
    
    this.app.use("/", swaggerUi.serve,swaggerUi.setup(swaggerDocument));
    
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json({limit: '100mb'}));
    this.app.use(cors());
}

 private initializeErrorHandling(){
   this.app.use(errorMiddleware);
 }

  private initializeControllers(controllers:IController[]) {
    controllers.forEach((controller) => {
      this.app.use('/api', controller.router);
    });
  }

  private connectToDatabase(){
    const {
      MONGODB_URL
      } = process.env;

      mongoose
        .connect(MONGODB_URL.toString(),{ useNewUrlParser: true,useUnifiedTopology:true,useFindAndModify:false,useCreateIndex: true})
        .then((result)=>{
            // handle connnection succedded
            console.log("CONNECTED TO DB")
        })
        .catch((err:Error)=>{
            // handle error database 
            console.log(err);
        })
    }

  public listen() {
    this.app.listen(this.PORT, () => {
      console.log(`App listening on the port ${this.PORT}`);
    });
  }
}
export default App;