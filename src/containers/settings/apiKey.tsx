import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  LightMode,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

interface FormInputs {
  openaiKey: string;
}

export const APIKeySettings: React.FC = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<FormInputs>();

  const handleSaveSettings = ({ openaiKey }: FormInputs) => {
    localStorage.setItem('OPENAI_KEY', openaiKey);
  };

  return (
    <>
      <Box fontSize="xl" fontWeight="bold">
        <Text color="blue.500" as="span">
          API Key
        </Text>{' '}
        Settings
      </Box>

      <Box color="gray.400" fontSize="sm" mb={4}>
        Your API Key is stored locally on your browser and never sent anywhere
        else.
      </Box>

      <form onSubmit={handleSubmit(handleSaveSettings)}>
        <VStack spacing={8}>
          <FormControl isInvalid={!!errors['openaiKey']}>
            <FormLabel>OpenAI Key</FormLabel>
            <Input
              defaultValue={localStorage.getItem('OPENAI_KEY') || ''}
              {...register('openaiKey', {
                required: {
                  message: 'OpenAI Key is required',
                  value: true,
                },
              })}
            />
            {errors['openaiKey'] && (
              <FormErrorMessage>
                {errors['openaiKey']?.message}
              </FormErrorMessage>
            )}
            <FormHelperText>
              Get your OpenAI API key{' '}
              <Link
                color="blue.500"
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
              >
                here
              </Link>
            </FormHelperText>
          </FormControl>

          <HStack>
            <LightMode>
              <Button colorScheme="blue" type="submit">
                Save
              </Button>
            </LightMode>
          </HStack>
        </VStack>
      </form>
    </>
  );
};
