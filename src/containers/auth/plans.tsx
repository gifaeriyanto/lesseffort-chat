import React from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { SimpleNavbar } from 'components/navbar/simple';
import { PricingPlans } from 'components/pricingPlans';
import { ComparePlans } from 'components/pricingPlans/comparePlans';

const PlansContainer: React.FC = () => {
  return (
    <Flex minH="100vh" justify="center">
      <Box pb="8rem">
        <SimpleNavbar backLink="/login" />
        <Heading mt="3rem" textAlign="center">
          Pricing{' '}
          <Text as="span" color="blue.500">
            Plans
          </Text>
        </Heading>
        <PricingPlans />
        <Heading my="3rem" textAlign="center">
          Compare{' '}
          <Text as="span" color="blue.500">
            Plans
          </Text>
        </Heading>
        <ComparePlans />
      </Box>
    </Flex>
  );
};

export default PlansContainer;
