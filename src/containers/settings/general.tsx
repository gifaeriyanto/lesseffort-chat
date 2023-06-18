import React from 'react';
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Select,
  Text,
  VStack,
} from '@chakra-ui/react';
import { AccentColorRadio } from 'components/radios/accentColor';
import { ColorModeRadio } from 'components/radios/colorMode';
import { FontSizeRadio } from 'components/radios/fontSize';
import { useUserData } from 'store/user';
import { accentColor } from 'theme/foundations/colors';
import { shallow } from 'zustand/shallow';

interface FormInputs {
  colorMode: string;
  accentColor: string;
}

export const GeneralSettings: React.FC = () => {
  const isFreeUser = useUserData((state) => state.isFreeUser, shallow);

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
          {isFreeUser && (
            <Box fontSize="sm" mb={4} mt={-2} color="gray.400">
              For premium user only
            </Box>
          )}
          <Box opacity={isFreeUser ? 0.5 : 1}>
            <ColorModeRadio />
          </Box>
        </FormControl>

        <FormControl>
          <FormLabel>Accent color</FormLabel>
          {isFreeUser && (
            <Box fontSize="sm" mb={4} mt={-2} color="gray.400">
              For premium user only
            </Box>
          )}
          <Box opacity={isFreeUser ? 0.5 : 1}>
            <AccentColorRadio />
          </Box>
        </FormControl>

        <FormControl>
          <FormLabel>Font size</FormLabel>
          <FontSizeRadio />
        </FormControl>
      </VStack>
    </>
  );
};
