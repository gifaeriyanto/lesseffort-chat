import React from 'react';
import { Box, FormControl, FormLabel, Text, VStack } from '@chakra-ui/react';
import { AccentColorRadio } from 'components/radios/accentColor';
import { ColorModeRadio } from 'components/radios/colorMode';
import { accentColor } from 'theme/foundations/colors';

interface FormInputs {
  colorMode: string;
  accentColor: string;
}

export const GeneralSettings: React.FC = () => {
  return (
    <>
      <Box fontSize="xl" fontWeight="bold" mb={4}>
        <Text color={accentColor('500')} as="span">
          General
        </Text>{' '}
        Settings
      </Box>

      <VStack spacing={8}>
        <FormControl>
          <FormLabel>Appearance</FormLabel>
          <ColorModeRadio />
        </FormControl>

        <FormControl>
          <FormLabel>Accent color</FormLabel>
          <AccentColorRadio />
        </FormControl>
      </VStack>
    </>
  );
};
