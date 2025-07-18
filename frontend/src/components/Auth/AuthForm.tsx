import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import * as Form from '@radix-ui/react-form';
import ImageUpload from './ImageUpload';
import GoogleButton from './GoogleButton';
import axios from 'axios';
import { AxiosError } from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { isTokenExpired } from '../../utils/auth';


type Props = {
  isSignUp: boolean;
  setIsSignUp: (val: boolean) => void;
};


const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;


const AuthForm = ({ isSignUp, setIsSignUp }: Props) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

 const location = useLocation();
  const errorMessage = location.state?.error;

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (token && !isTokenExpired(token)) {
    navigate('/dashboard');
  }
}, []);


  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file && file.type.startsWith('image/')) {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: data,
      });

      const cloudData = await res.json();
      setImagePreview(cloudData.secure_url);
    } catch (err) {
      console.error('Upload failed:', err);
      setImagePreview(null);
    }
  } else {
    setImagePreview(null);
  }
};


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const payload = {
    ...formData,
    image: imagePreview,
  };

  try {
    const response = await axios.post(
      `http://localhost:5000/api/auth${isSignUp ? '/signup' : '/signin'}`,
      payload
    );
    const data = response.data;

    toast.success(isSignUp ? 'User created successfully!' : 'Signed in successfully!', {
      position: 'top-center',
    });

    // ✅ Save token and redirect after signin
    if (!isSignUp && data.token) {
      localStorage.setItem('token', data.token);
      navigate('/dashboard'); // 🔁 Redirect to dashboard
    }

    setFormData({ username: '', email: '', password: '' });
    setImagePreview(null);
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error('Error submitting form:', axiosError.response?.data || axiosError.message);
    toast.error(axiosError.response?.data?.message || 'Something went wrong!');
  }
};


  return (
    <>
      <Form.Root className="space-y-0.5" onSubmit={handleSubmit}>
        {isSignUp && (
          <>
            <ImageUpload imagePreview={imagePreview} onChange={handleImageChange} />

            <Form.Field name="username">
              <div className="mb-2">
                <Form.Label className="block text-sm font-medium text-gray-700">
                  Username
                </Form.Label>
              </div>
              <Form.Control asChild>
                <input
                  name="username"
                  type="text"
                  placeholder="johndoe123"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  minLength={2}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </Form.Control>
            </Form.Field>

          </>
        )}

        <Form.Field name="email">
          <div className="mb-2">
            <Form.Label className="block text-sm font-medium text-gray-700">Email</Form.Label>
          </div>
          <Form.Control asChild>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </Form.Control>
        </Form.Field>

        <Form.Field name="password">
          <div className="mb-2">
            <Form.Label className="block text-sm font-medium text-gray-700">Password</Form.Label>
          </div>
          <Form.Control asChild>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={6}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </Form.Control>
        </Form.Field>
        <Form.Submit asChild>
          <button
            type="submit"
            className="w-full mt-2 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </Form.Submit>
      </Form.Root>
      <div className='mt-2'>
        <GoogleButton />
      </div>
      <p className="text-sm text-center text-gray-500 mt-6">
        {isSignUp ? (
          <>
            Already have an account?{' '}
            <button
              className="text-indigo-600 hover:underline"
              onClick={() => {
                setIsSignUp(false);
                setImagePreview(null);
              }}
            >
              Sign In
            </button>
          </>
        ) : (
          <>
            Don’t have an account?{' '}
            <button className="text-indigo-600 hover:underline" onClick={() => setIsSignUp(true)}>
              Sign Up
            </button>
          </>
        )}
      </p>
    </>
  );
};

export default AuthForm;


