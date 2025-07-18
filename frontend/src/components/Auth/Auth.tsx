import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import AuthForm from './AuthForm';

const AuthDialog = () => {
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <Dialog.Root open>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="bg-white w-[400px] rounded-2xl p-8 shadow-xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Dialog.Title className="text-2xl font-bold text-center mb-6">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </Dialog.Title>

          <AuthForm isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AuthDialog;
