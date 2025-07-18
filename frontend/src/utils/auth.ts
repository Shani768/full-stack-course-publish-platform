import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  exp: number;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000; // current time in seconds
    return decoded.exp < currentTime;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Token decoding error:', err.message);
    } else {
      console.error('Unknown error during token decoding.');
    }
    return true; // Consider invalid/expired if error occurs
  }
};
