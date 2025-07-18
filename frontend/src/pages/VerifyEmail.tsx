import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        toast.error('Token not found in URL.');
        return;
      }

      try {
        await axios.post('http://localhost:5000/api/auth/verify-email', { token });
        toast.success('✅ Email verified successfully!');
        setTimeout(() => navigate('/'), 2000);
      } catch (error) {
        console.error('Email verification error:', error);
        toast.error('❌ Invalid or expired token.');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <Toaster position="top-center" />
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center animate-fade-in">
        <div className="text-4xl mb-4">📧</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Verifying Email</h2>
        <p className="text-gray-600">Please wait while we verify your email...</p>
        <div className="mt-6 animate-pulse text-indigo-500">Loading...</div>
      </div>
    </div>
  );
};

export default VerifyEmail;
