import React from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  LightMode,
  useBoolean,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { TbMail } from 'react-icons/tb';
import { forgotPassword, SignWithEmailParams } from 'store/supabase/auth';
import { accentColor } from 'theme/foundations/colors';

type ForgotParams = Pick<SignWithEmailParams, 'email'>;

export const ForgotContainer: React.FC = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ForgotParams>();
  const [isLoading, { on, off }] = useBoolean();

  const handleSubmitForgot = ({ email }: ForgotParams) => {
    on();
    forgotPassword(email).finally(off);
  };

  return (
    <Flex minH="100vh" justify="center" align="center">
      <Box
        bgColor={{ md: 'gray.600' }}
        w="full"
        maxW="30rem"
        p="3rem"
        borderRadius="xl"
        _light={{ bgColor: { md: 'gray.50' } }}
      >
        <Heading mb={8} textAlign="center">
          Forgot Password
        </Heading>

        <form onSubmit={handleSubmit(handleSubmitForgot)}>
          <FormControl isInvalid={!!errors['email']}>
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none">
                <Icon as={TbMail} color={accentColor('500')} />
              </InputLeftElement>
              <Input
                fontSize="md"
                borderRadius="xl"
                type="email"
                placeholder="Enter your email address"
                {...register('email', {
                  required: {
                    message: 'Email is required',
                    value: true,
                  },
                })}
              />
            </InputGroup>
            {errors['email'] && (
              <FormErrorMessage>{errors['email']?.message}</FormErrorMessage>
            )}
          </FormControl>

          <LightMode>
            <Button
              colorScheme={accentColor()}
              type="submit"
              w="full"
              mt={8}
              borderRadius="xl"
              size="lg"
              fontSize="md"
              isLoading={isLoading}
            >
              Send reset link
            </Button>
          </LightMode>
        </form>
      </Box>
    </Flex>
  );
};
