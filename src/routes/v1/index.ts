/* This TypeScript code snippet is setting up a basic routing configuration using Express.js. Here's a
breakdown of what it does: */

import express, { Router } from 'express';
import authRoute from './auth.route';

const router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

const defaultIRoute: IRoute[] = [
  {
    path: '/auth',
    route: authRoute,
  },
];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
