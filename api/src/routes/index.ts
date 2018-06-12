import * as express from 'express';
import LoginRoute from './login';
import PersonalDataRoutes from './personalDataRoute';

export default class Routes {
  public routes(app): void {
    app.get('/', (req: express.Request, res: express.Response) => {
      res.status(200).send({
        message: 'GET request successfull! For: /'
      });
    });
    app.use('/login', LoginRoute);
    app.use('/personal-data', PersonalDataRoutes);
  }
}
