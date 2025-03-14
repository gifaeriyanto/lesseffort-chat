import { Box, SimpleGrid } from '@chakra-ui/react';

import { ActionButton } from './actionButton';
import { pricingData } from './data';
import { PricingCard } from './pricingCard';

export enum Plan {
  free = 'Free',
  premium = 'Premium',
  premiumAnnually = 'Premium (Annual)',
}

export interface PricingPlansProps {
  isLoading?: boolean;
  onSelect?: (id: Plan) => void;
}

export const PricingPlans: React.FC<PricingPlansProps> = ({
  isLoading,
  onSelect,
}) => (
  <Box as="section" py="14" px={{ base: '4', md: '8' }}>
    <SimpleGrid
      columns={{ base: 1, lg: 3 }}
      spacing={{ base: '8', lg: '0' }}
      maxW="7xl"
      mx="auto"
      justifyItems="center"
      alignItems="center"
      gap={8}
    >
      <PricingCard
        data={{
          price: '$0',
          name: Plan.free,
          time: '',
          features: pricingData.features.free,
        }}
        button={
          <ActionButton
            onClick={() => onSelect?.(Plan.free)}
            variant="outline"
            // mt={10}
          >
            Continue free
          </ActionButton>
        }
      />

      <PricingCard
        data={{
          price: '$3',
          name: Plan.premium,
          time: 'month',
          features: pricingData.features.premium,
        }}
        button={
          <>
            {/* <Box mb={4} textAlign="center">
              30-day free trial
            </Box> */}
            <ActionButton
              onClick={() => onSelect?.(Plan.premium)}
              isLoading={isLoading}
            >
              Buy now
            </ActionButton>
          </>
        }
      />

      <PricingCard
        badge="Popular"
        mostExpensive
        data={{
          price: '$30',
          realPrice: '$36',
          name: Plan.premiumAnnually,
          time: 'year',
          features: pricingData.features.premium,
        }}
        button={
          <>
            {/* <Box mb={4} textAlign="center">
              30-day free trial
            </Box> */}
            <ActionButton
              onClick={() => onSelect?.(Plan.premiumAnnually)}
              isLoading={isLoading}
            >
              Buy now
            </ActionButton>
          </>
        }
      />
    </SimpleGrid>
  </Box>
);
