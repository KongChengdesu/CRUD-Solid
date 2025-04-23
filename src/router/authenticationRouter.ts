import { Router } from 'express';
import { Login, LoginCallback, CheckSessionStatus } from '../db/authenticationController';

const AuthenticationRouter = Router();

AuthenticationRouter.post('/login', Login);
AuthenticationRouter.post('/callback', LoginCallback);
AuthenticationRouter.get('/session', CheckSessionStatus);

export default AuthenticationRouter;