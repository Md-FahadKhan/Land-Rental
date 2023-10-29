import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1]; // Assuming you send the token as a Bearer token
    if (token) {
      try {
        const decoded = jwt.verify(token, 'your-secret-key');
        req['user'] = decoded; // Add the user information to the request object
        next();
      } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
      }
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  }
}
