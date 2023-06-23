import { Box, SimpleGrid } from '@chakra-ui/react';

import { ActionButton } from './actionButton';
import { PricingCard } from './pricingCard';

export enum Plan {
  free = 'Free',
  premium = 'Premium',
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
      columns={{ base: 1, lg: 2 }}
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
          features: [
            'Max 5 chat history',
            ['Chat rules', '170+ language, tone, writing style and format'],
            ['Starter prompts', '6 uses per-day'],
            'Light mode & dark mode',
            'Change font size',
          ],
        }}
        button={
          <ActionButton
            onClick={() => onSelect?.(Plan.free)}
            variant="outline"
            mt={10}
          >
            Continue free
          </ActionButton>
        }
      />
      <PricingCard
        isRecommended
        data={{
          price: '$9.99',
          name: Plan.premium,
          time: 'month',
          features: [
            'Unlimited chat history',
            'Unlimited starter prompts usage',
            'Save prompts',
            'Save messages',
            'Save & Share conversations',
            'And more...',
          ],
        }}
        button={
          <>
            <Box mb={4} textAlign="center">
              Trial for 3 days, cancel anytime
            </Box>
            <ActionButton
              onClick={() => onSelect?.(Plan.premium)}
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
