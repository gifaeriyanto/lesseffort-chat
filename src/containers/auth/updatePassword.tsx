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
  InputRightElement,
  LightMode,
  useBoolean,
} from '@chakra-ui/react';
import { SignWithEmailParams, updatePassword } from 'api/supabase/auth';
import { useForm } from 'react-hook-form';
import { TbLock } from 'react-icons/tb';
import { redirect } from 'react-router-dom';
import { accentColor } from 'theme/foundations/colors';

type UpdatePasswordParams = Pick<SignWithEmailParams, 'password'>;

export const UpdatePasswordContainer: React.FC = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<UpdatePasswordParams>();
  const [show, setShow] = React.useState(false);
  const [isLoading, { on, off }] = useBoolean();

  const toggleShow = () => setShow(!show);

  const handleSubmitForgot = ({ password }: UpdatePasswordParams) => {
    on();
    updatePassword(password).finally(off);
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
          Update Password
        </Heading>

        <form onSubmit={handleSubmit(handleSubmitForgot)}>
          <FormControl isInvalid={!!errors['password']}>
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none">
                <Icon as={TbLock} color={accentColor('500')} />
              </InputLeftElement>
              <Input
                fontSize="md"
                borderRadius="xl"
                type={show ? 'text' : 'password'}
                placeholder="Enter your new password"
                {...register('password', {
                  required: {
                    message: 'Password is required',
                    value: true,
                  },
                })}
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={toggleShow}
                  variant="link"
                >
                  {show ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
            {errors['password'] && (
              <FormErrorMessage>{errors['password']?.message}</FormErrorMessage>
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
              Submit
            </Button>
          </LightMode>
        </form>
      </Box>
    </Flex>
  );
};
