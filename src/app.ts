import express from 'express';
import dotenv from 'dotenv';

import { Router } from 'express';
import AuthenticationRouter from './router/authenticationRouter';
import OperationsRouter from './router/operationsRouter';

dotenv.config();

const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.use(express.json());

app.use('/auth', AuthenticationRouter);
app.use('/op', OperationsRouter);