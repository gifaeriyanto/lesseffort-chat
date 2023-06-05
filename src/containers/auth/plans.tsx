import React from 'react';
import { Box, Flex, Heading, Text, useBoolean } from '@chakra-ui/react';
import { captureException } from '@sentry/react';
import { createPlan } from 'api/plan';
import { SimpleNavbar } from 'components/navbar/simple';
import { Plan, PricingPlans } from 'components/pricingPlans';
import { ComparePlans } from 'components/pricingPlans/comparePlans';
import { useNavigate } from 'react-router-dom';
import { accentColor } from 'theme/foundations/colors';

const PlansContainer: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, { on, off }] = useBoolean();

  const handleBuyPremium = async () => {
    on();
    await createPlan()
      .then((res) => {
        window.location.href = res?.data.data.attributes.url;
      })
      .catch((error) => {
        captureException(error);
        off();
      });
  };

  const handleSelectPlan = async (plan: Plan) => {
    switch (plan) {
      case Plan.premium:
        await handleBuyPremium();
        return;

      case Plan.free:
      default:
        navigate('/');
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
        <PricingPlans onSelect={handleSelectPlan} isLoading={isLoading} />
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
