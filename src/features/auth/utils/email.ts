import axios from 'axios';

export const checkEmailValidity = async (email: string) => {
  try {
    const { data } = await axios.post('/api/email/validate', { email });
    return data.isValid;
  } catch (error) {
    console.error('Error checking email validity:', error);
    return false;
  }
};

export const validateEmailRegex = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
