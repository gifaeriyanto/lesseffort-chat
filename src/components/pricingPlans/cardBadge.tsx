import { Flex, FlexProps, Text, useColorModeValue } from '@chakra-ui/react';
import { accentColor } from 'theme/foundations/colors';

export const CardBadge = (props: FlexProps) => {
  const { children, ...flexProps } = props;
  return (
    <Flex
      bg={useColorModeValue(accentColor('500'), accentColor('200'))}
      position="absolute"
      right="-4.8rem"
      top="2rem"
      width="240px"
      transform="rotate(45deg)"
      py={2}
      justifyContent="center"
      alignItems="center"
      color={useColorModeValue('white', 'gray.800')}
      {...flexProps}
    >
      <Text
        fontSize="xs"
        textTransform="uppercase"
        fontWeight="bold"
        letterSpacing="wider"
      >
        {children}
      </Text>
    </Flex>
  );
};
