import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import * as express from 'express';
import { Database } from './database';
import { AppBuilder } from './appBuilder';
import { AuthController } from './controller/Auth.controller';
import { UsersController } from './controller/User.controller';
import { errorMiddleware } from './middleware/error.middleware';
import { AuthController } from './controller/Auth.controller';

const app = express();
const appBuilder = new AppBuilder(app);
const PORT: number = Number(process.env.PORT) || 5000;
Database.initialize();

appBuilder
  .addMiddleware(express.json())
  .addController(new UsersController())
  .addController(new AuthController())
  .addMiddleware(errorMiddleware)
  .build(PORT, () => console.log(`listening on port: ${PORT}`));
