import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  LightMode,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import { AccentColorRadio } from 'components/radios/accentColor';
import { ColorModeRadio } from 'components/radios/colorMode';
import { useForm } from 'react-hook-form';

interface FormInputs {
  colorMode: string;
  accentColor: string;
}

export const GeneralSettings: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
  } = useForm<FormInputs>({
    defaultValues: {
      accentColor: 'blue',
      colorMode: localStorage.getItem('chakra-ui-color-mode') || colorMode,
    },
  });

  const handleSaveSettings = ({ accentColor, colorMode }: FormInputs) => {
    console.log(accentColor, colorMode);
  };

  return (
    <>
      <Box fontSize="xl" fontWeight="bold" mb={4}>
        <Text color="blue.500" as="span">
          General
        </Text>{' '}
        Settings
      </Box>

      <VStack spacing={8}>
        <FormControl>
          <FormLabel>Appearance</FormLabel>
          <ColorModeRadio
            defaultValue={
              localStorage.getItem('chakra-ui-color-mode') || 'dark'
            }
            onChange={toggleColorMode}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Accent color</FormLabel>
          <AccentColorRadio
            defaultValue={localStorage.getItem('accentColor') || 'blue'}
          />
        </FormControl>
      </VStack>
    </>
  );
};
