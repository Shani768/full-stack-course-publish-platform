// ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { isTokenExpired } from '../../utils/auth';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem('token');

  if (!token || isTokenExpired(token)) {
    return (
      <Navigate
        to="/"
        replace
        state={{ error: 'Invalid token, please sign in again.' }}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
