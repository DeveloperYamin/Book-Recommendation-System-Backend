/* This code snippet is implementing a JWT (JSON Web Token) authentication strategy using Passport.js
in a TypeScript environment. Here's a breakdown of what each part of the code is doing: */

import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import config from '../utils/config';
import { IPayload, tokenTypes } from '../interfaces/token.interface';
import User from '../models/user.model';

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (payload: IPayload, done) => {
    try {
      if (payload.type !== tokenTypes.ACCESS) {
        throw new Error('Invalid token type');
      }
      const user = await User.findById(payload.sub);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);

export default jwtStrategy;
