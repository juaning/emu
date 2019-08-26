import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import Routes from './routes';

class App {
  public app: express.Application;
  public routePrv: Routes = new Routes();
  public mongoUrl: string = process.env.MONGO_URL;
  public mongoUser: string = process.env.MONGO_USR;
  public mongoPwd: string = process.env.MONGO_PWD;
  public isLocal: boolean = process.env.IS_LOCAL === 'true';

  constructor() {
    this.app = express();
    this.config();
    this.routePrv.routes(this.app);
    this.mongoSetup();
  }

  private config(): void {
    // support application/json type post data
    this.app.use(bodyParser.json());

    // support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  private mongoSetup(): void {
    mongoose.Promise = global.Promise;
    const options = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      user: this.isLocal ? '' : this.mongoUser,
      pass: this.isLocal ? '' : this.mongoPwd,
    };
    mongoose.connect(this.mongoUrl, options);
  }
}

export default new App().app;