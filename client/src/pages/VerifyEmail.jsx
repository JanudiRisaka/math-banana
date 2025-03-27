useEffect(() => {
  const verifyToken = async () => {
    try {
      if (!token) {
        navigate('/verify-email-error?message=Missing verification token');
        return;
      }

      const response = await axios.get(
        'http://localhost:5000/auth/verify-email',
        { params: { token } }
      );

      if (response.data.verified) {
        alert('Email verified successfully! Please login.');
        navigate('/signin');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
                         error.message || 'Verification failed';
      navigate(`/verify-email-error?message=${encodeURIComponent(errorMessage)}`);
    }
  };

  if (token) verifyToken();
}, [token, navigate]);