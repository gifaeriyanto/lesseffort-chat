import { Box, BoxProps, LightMode, useColorModeValue } from '@chakra-ui/react';

import { CardBadge } from './cardBadge';

export interface CardProps extends BoxProps {
  isRecommended?: boolean;
}

export const Card = (props: CardProps) => {
  const { children, isRecommended, ...rest } = props;
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
      {isRecommended && (
        <LightMode>
          <CardBadge>Recommended</CardBadge>
        </LightMode>
      )}
      {children}
    </Box>
  );
};
