import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GoogleLoginButton = () => {
   const navigate = useNavigate(); 
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const { credential } = credentialResponse;

    if (!credential) {
      console.error('No credential returned from Google');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/google', {
        token: credential,
      });

      localStorage.setItem('token', res.data.token);
      console.log('User:', res.data.user);

       navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="w-full max-w-[250px] sm:max-w-[300px] mx-auto">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log('Login Failed')}
        width="100%"
      />
    </div>
  );
};

export default GoogleLoginButton;
