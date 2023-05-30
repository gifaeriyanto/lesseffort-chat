import React, { useLayoutEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const PurchasedRedirect: React.FC = () => {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    localStorage.setItem('purchased', 'true');
    navigate('/');
  }, []);

  return <Box p={8}>Redirect...</Box>;
};

export default PurchasedRedirect;
