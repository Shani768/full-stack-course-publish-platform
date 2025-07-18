import { Request } from 'express';


export interface AuthRequestBody {
  username?: string;
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}


export interface GoogleLoginRequestBody {
  token: string;
}

// Optionally define what Google returns
export interface GoogleUserData {
  email: string;
  name?: string;
  picture?: string;
}
