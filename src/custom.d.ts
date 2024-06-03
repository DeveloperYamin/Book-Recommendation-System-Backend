/* This code snippet is extending the `express-serve-static-core` module in TypeScript. */

import { IUserDoc } from './modules/user/user.interfaces';

declare module 'express-serve-static-core' {
  export interface Request {
    user: IUserDoc;
  }
}
