import * as express from 'express';
import LoginController from './../controllers/LoginController';

const router = express.Router();
const loginController = new LoginController();

router.route('/')
.post(loginController.login);

export default router;