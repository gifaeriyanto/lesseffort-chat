import React from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  LightMode,
  VStack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { TbLock, TbMail } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import { signInWithGoogle } from 'store/supabase/auth';
import { CustomColor } from 'theme/foundations/colors';

interface FormInputs {
  email: string;
  password: string;
}

export const LoginContainer: React.FC = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormInputs>();
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const handleLogin = ({}: FormInputs) => {};

  return (
    <Flex minH="100vh" justify="center" align="center">
      <Box
        bgColor="gray.600"
        w="full"
        maxW="30rem"
        p="3rem"
        borderRadius="xl"
        _light={{ bgColor: 'gray.50' }}
      >
        <Heading mb={8} textAlign="center">
          Login
        </Heading>

        <form onSubmit={handleSubmit(handleLogin)}>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors['email']}>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <Icon as={TbMail} color="blue.500" />
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

            <FormControl isInvalid={!!errors['password']}>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <Icon as={TbLock} color="blue.500" />
                </InputLeftElement>
                <Input
                  fontSize="md"
                  borderRadius="xl"
                  type={show ? 'text' : 'password'}
                  placeholder="Enter your password"
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
                    onClick={handleClick}
                    variant="link"
                  >
                    {show ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {errors['password'] && (
                <FormErrorMessage>
                  {errors['password']?.message}
                </FormErrorMessage>
              )}
            </FormControl>
          </VStack>

          <Button
            as={Link}
            to="/forgot-password"
            mt={8}
            display="inline-block"
            fontSize="sm"
            variant="link"
          >
            Having trouble in sign in?
          </Button>

          <LightMode>
            <Button
              colorScheme="blue"
              type="submit"
              w="full"
              mt={8}
              borderRadius="xl"
              size="lg"
              fontSize="md"
            >
              Save
            </Button>
          </LightMode>
        </form>

        <Flex align="center" justify="center" gap={4} my={8}>
          <Box
            w="30%"
            h="2px"
            bgColor={CustomColor.border}
            _light={{ bgColor: CustomColor.lightBorder }}
          />
          <Box>OR</Box>
          <Box
            w="30%"
            h="2px"
            bgColor={CustomColor.border}
            _light={{ bgColor: CustomColor.lightBorder }}
          />
        </Flex>

        <HStack w="full">
          <Button
            leftIcon={<Icon as={FcGoogle} mr={4} fontSize="xl" />}
            onClick={signInWithGoogle}
            w="full"
            variant="outline"
            borderRadius="xl"
            size="lg"
            fontSize="md"
          >
            Sign in with Google
          </Button>
        </HStack>
      </Box>
    </Flex>
  );
};
