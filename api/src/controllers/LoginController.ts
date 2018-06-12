import { Request, Response } from 'express';

/**
 * TODO: Add logic and DB connection
 */

class LoginController {
  public login(req: Request, res: Response) {
    const user = req.body;
    res.json({message: 'Successfully logged!'});
  }
};

export default LoginController;