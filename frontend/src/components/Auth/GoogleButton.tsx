// import { FcGoogle } from 'react-icons/fc';

// const GoogleButton = () => {
//   return (
//     <button
//       onClick={() => alert('Google Auth')}
//       className="w-full mt-4 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition mb-6"
//     >
//       <FcGoogle className="text-xl" />
//       <span>Continue with Google</span>
//     </button>
//   );
// };

// export default GoogleButton;
// GoogleLoginButton.tsx

import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';

import axios from 'axios';

const GoogleLoginButton = () => {
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
