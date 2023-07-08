import { Box, BoxProps, LightMode, useColorModeValue } from '@chakra-ui/react';

import { CardBadge } from './cardBadge';

export interface CardProps extends BoxProps {
  badge?: string;
  mostExpensive?: boolean;
}

export const Card = (props: CardProps) => {
  const { children, badge, mostExpensive, ...rest } = props;

  const badgeProps = () => {
    if (mostExpensive) {
      return {
        bg: 'gold',
        color: 'gray.800',
      };
    }
    return {};
  };

  return (
    <Box
      bg={useColorModeValue('white', 'gray.700')}
      position="relative"
      px="6"
      pb="6"
      pt="16"
      overflow="hidden"
      shadow="lg"
      maxW="md"
      width="100%"
      {...rest}
    >
      {badge && (
        <LightMode>
          <CardBadge {...badgeProps()}>{badge}</CardBadge>
        </LightMode>
      )}
      {children}
    </Box>
  );
};
