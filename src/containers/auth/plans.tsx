import React from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { SimpleNavbar } from 'components/navbar/simple';
import { Plan, PricingPlans } from 'components/pricingPlans';
import { ComparePlans } from 'components/pricingPlans/comparePlans';
import { useNavigate } from 'react-router-dom';
import { accentColor } from 'theme/foundations/colors';

const PlansContainer: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectPlan = (plan: Plan) => {
    switch (plan) {
      case Plan.free:
        navigate('/');
        return;

      case Plan.premium:
        // subs logic
        return;
      default:
        return;
    }
  };

  return (
    <Flex minH="100vh" justify="center">
      <Box pb="8rem">
        <SimpleNavbar backLink="/login" />
        <Heading mt="3rem" textAlign="center">
          Pricing{' '}
          <Text as="span" color={accentColor('500')}>
            Plans
          </Text>
        </Heading>
        <PricingPlans onSelect={handleSelectPlan} />
        <Heading my="3rem" textAlign="center">
          Compare{' '}
          <Text as="span" color={accentColor('500')}>
            Plans
          </Text>
        </Heading>
        <ComparePlans onSelect={handleSelectPlan} />
      </Box>
    </Flex>
  );
};

export default PlansContainer;
