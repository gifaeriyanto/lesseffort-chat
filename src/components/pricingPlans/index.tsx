import { Box, SimpleGrid } from '@chakra-ui/react';

import { ActionButton } from './actionButton';
import { PricingCard } from './pricingCard';

export enum Plan {
  free = 'Free',
  premium = 'Premium',
}

export interface PricingPlansProps {
  onSelect?: (id: Plan) => void;
}

export const PricingPlans: React.FC<PricingPlansProps> = ({ onSelect }) => (
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
            'Light mode',
            'Change font size',
          ],
        }}
        button={
          <ActionButton onClick={() => onSelect?.(Plan.free)} variant="outline">
            Continue free
          </ActionButton>
        }
      />
      <PricingCard
        isRecommended
        data={{
          price: '$9',
          name: Plan.premium,
          time: 'month',
          features: [
            'Unlimited chat history',
            'Unlimited starter prompts usage',
            'Save prompts',
            'Save messages',
            'Share conversations',
            'Light & Dark mode',
            'And more...',
          ],
        }}
        button={
          <ActionButton onClick={() => onSelect?.(Plan.premium)}>
            Buy now
          </ActionButton>
        }
      />
    </SimpleGrid>
  </Box>
);
