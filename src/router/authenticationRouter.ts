import { Router } from 'express';
import { Login, LoginCallback } from '../db/authenticationController';

const AuthenticationRouter = Router();

AuthenticationRouter.get('/login', Login);
AuthenticationRouter.get('/callback', LoginCallback);

export default AuthenticationRouter;