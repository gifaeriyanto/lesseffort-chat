import React, { useState } from 'react';
import {
  Alert,
  AlertDescription,
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Link,
  Text,
  useBoolean,
  VStack,
} from '@chakra-ui/react';
import { TypingDots } from 'components/typingDots';
import { useForm } from 'react-hook-form';
import { accentColor } from 'theme/foundations/colors';
import { debounce } from 'utils/common';

interface FormInputs {
  openaiKey: string;
}

export const APIKeySettings: React.FC = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormInputs>();
  const [isSaving, { on, off }] = useBoolean();
  const [showSavingState, setShowSavingState] = useState(false);

  const debounceOnChange = debounce(
    (setter: Function, value: unknown) => setter(value),
    2000,
  );

  const handleSaveSettings = ({ openaiKey }: FormInputs) => {
    localStorage.setItem('OPENAI_KEY', openaiKey);

    off();
    setShowSavingState(true);
  };

  return (
    <>
      <Box fontSize="xl" fontWeight="bold">
        <Text color={accentColor('500')} as="span">
          API Key
        </Text>{' '}
        Settings
      </Box>

      <Box color="gray.400" fontSize="sm" mb={4}>
        Your API Key is stored locally on your browser and never sent anywhere
        else.
        <Text
          as="span"
          color={accentColor('500')}
          ml={2}
          hidden={!showSavingState || !!Object.keys(errors).length}
        >
          {isSaving ? (
            <>
              Saving
              <TypingDots />
            </>
          ) : (
            'Saved'
          )}
        </Text>
      </Box>

      <Alert mb={4} borderRadius="lg">
        <AlertDescription fontSize="sm">
          Make sure your OpenAI account is already a paid user. If not, click
          here:{' '}
          <Link
            href="https://platform.openai.com/account/billing/payment-methods"
            target="_blank"
            color={accentColor('500')}
          >
            Upgrade now!
          </Link>
        </AlertDescription>
      </Alert>

      <form
        onSubmit={handleSubmit(handleSaveSettings)}
        onChange={(e) => {
          if (!showSavingState) {
            setShowSavingState(true);
          }
          on();
          debounceOnChange(handleSubmit(handleSaveSettings), e);
        }}
      >
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
                minLength: {
                  message: 'Please input a valid OpenAI key',
                  value: 50,
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
                color={accentColor('500')}
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
              >
                here
              </Link>
            </FormHelperText>
          </FormControl>
        </VStack>
      </form>
    </>
  );
};
