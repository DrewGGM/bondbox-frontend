import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthLayout } from '@/components/features/auth/AuthLayout';
import { LoginForm, LoginFormData } from '@/components/features/auth/LoginForm';
import { VerificationCodeModal } from '@/components/features/auth/VerificationCodeModal';
import { useUser } from '@/hooks/useUser';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading, error, login, otpVerification, clearError } = useUser();
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [otpAttempted, setOtpAttempted] = useState(false);

  const handleLogin = async (data: LoginFormData) => {
    clearError();
    setUserEmail(data.email);
    setUserPassword(data.password);

    await login({
      email: data.email,
      password: data.password
    });

    // Check error state after login completes
    // If no error, login succeeded and we should show verification modal
  };

  useEffect(() => {
    // Show verification modal after successful login
    if (!isLoading && !error && userEmail && !showVerificationModal) {
      setShowVerificationModal(true);
      toast.success('Código de verificación enviado');
    }
  }, [isLoading, error, userEmail]);

  useEffect(() => {
    // Navigate to dashboard after successful OTP verification
    if (otpAttempted && !isLoading && !error) {
      toast.success('Código verificado correctamente');
      setShowVerificationModal(false);
      navigate('/dashboard');
      setOtpAttempted(false);
    }
  }, [otpAttempted, isLoading, error]);

  useEffect(() => {
    // Show toast for OTP verification errors only
    if (otpAttempted && !isLoading && error) {
      toast.error(error);
      setOtpAttempted(false);
    }
  }, [otpAttempted, isLoading, error]);

  const handleVerifyCode = async (code: string) => {
    clearError();
    setOtpAttempted(true);

    await otpVerification({
      code: code,
      email: userEmail
    });
  };

  const handleResendCode = async () => {
    clearError();

    // Resend by calling login again with stored credentials
    await login({
      email: userEmail,
      password: userPassword
    });

    if (!error) {
      toast.success('Código reenviado', { icon: '📧' });
    }
  };

  const handleCloseModal = () => {
    setShowVerificationModal(false);
    clearError();
  };

  return (
    <>
      <AuthLayout>
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />
      </AuthLayout>

      <VerificationCodeModal
        isOpen={showVerificationModal}
        onClose={handleCloseModal}
        email={userEmail}
        onVerify={handleVerifyCode}
        onResend={handleResendCode}
        isLoading={isLoading}
      />
    </>
  );
};
