import { Router } from 'express';
import { Login, LoginCallback } from '../db/authenticationController';

const AuthenticationRouter = Router();

AuthenticationRouter.post('/login', Login);
AuthenticationRouter.post('/callback', LoginCallback);

export default AuthenticationRouter;