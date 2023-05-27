import { Button, ButtonProps } from '@chakra-ui/react';
import { accentColor } from 'theme/foundations/colors';

export const ActionButton = (props: ButtonProps) => (
  <Button
    colorScheme={accentColor()}
    size="lg"
    w="full"
    fontWeight="extrabold"
    py={{ md: '8' }}
    borderRadius="xl"
    {...props}
  />
);
