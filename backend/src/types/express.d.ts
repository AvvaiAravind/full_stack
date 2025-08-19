import { JwtPayload as BaseJwtPayload } from "jsonwebtoken";

// Extend the base JWT payload with your custom properties
export interface JwtPayload extends BaseJwtPayload {
  userId?: string;
  username?: string;
  roles?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
