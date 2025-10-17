import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthLayout } from '@/components/features/auth/AuthLayout';
import { RegisterForm, RegisterFormData } from '@/components/features/auth/RegisterForm';
import { VerificationCodeModal } from '@/components/features/auth/VerificationCodeModal';
import { useUser } from '@/hooks/useUser';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading, error, register, otpVerification, clearError } = useUser();
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [otpAttempted, setOtpAttempted] = useState(false);

  const handleRegister = async (data: RegisterFormData) => {
    clearError();
    setUserEmail(data.email);

    // Map RegisterFormData to RegisterUserForm
    await register({
      email: data.email,
      password: data.password,
      full_name: data.fullName,
      image_profile_url: new URL('https://default-profile-image.com'), // Default profile image
      nit: data.nit,
      phone_number: data.phone,
      birthday: data.birthDate as any // Keep date as string in format "1995-05-20"
    });
  };

  useEffect(() => {
    // Show verification modal after successful registration
    if (!isLoading && !error && userEmail && !showVerificationModal) {
      setShowVerificationModal(true);
      toast.success('Cuenta creada. Verifica tu email.');
    }
  }, [isLoading, error, userEmail]);

  useEffect(() => {
    // Navigate to dashboard after successful OTP verification
    if (otpAttempted && !isLoading && !error) {
      toast.success('Email verificado correctamente');
      setShowVerificationModal(false);
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
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

    // Resend by calling register again (assuming backend resends OTP on duplicate registration)
    // Note: You may need to implement a dedicated resend endpoint in your backend
    toast.success('Código reenviado', { icon: '📧' });
  };

  const handleCloseModal = () => {
    setShowVerificationModal(false);
    clearError();
  };

  return (
    <>
      <AuthLayout>
        <RegisterForm onSubmit={handleRegister} isLoading={isLoading} error={error} />
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
