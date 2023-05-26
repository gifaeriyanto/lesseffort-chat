import React, { useState } from 'react';
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
  Text,
  useBoolean,
  VStack,
} from '@chakra-ui/react';
import { Plan } from 'components/pricingPlans';
import { standaloneToast } from 'index';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { TbLock, TbMail, TbUser } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import { signInWithGoogle, signUp, SignUpParams } from 'store/supabase/auth';
import { CustomColor } from 'theme/foundations/colors';

export const SignUpContainer: React.FC = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignUpParams>();
  const [show, setShow] = React.useState(false);
  const [isLoading, { on, off }] = useBoolean();

  const toggleShow = () => setShow(!show);

  const handleSubmitSignup = (params: SignUpParams) => {
    on();
    signUp(params)
      .then((res) => {
        if (res.error?.message) {
          standaloneToast({
            title: 'Error login',
            description: res.error.message,
            position: 'top',
            status: 'error',
          });
        }
      })
      .finally(off);
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
        <Heading mb={2} textAlign="center">
          Sign Up
        </Heading>

        <Text mb={8} color="gray.400" textAlign="center">
          <Text color="gray.400">Create a free account</Text>
        </Text>

        <form onSubmit={handleSubmit(handleSubmitSignup)}>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors['name']}>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <Icon as={TbUser} color="blue.500" />
                </InputLeftElement>
                <Input
                  fontSize="md"
                  borderRadius="xl"
                  type="text"
                  placeholder="Enter your name"
                  {...register('name', {
                    required: {
                      message: 'Name is required',
                      value: true,
                    },
                  })}
                />
              </InputGroup>
              {errors['name'] && (
                <FormErrorMessage>{errors['name']?.message}</FormErrorMessage>
              )}
            </FormControl>

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
                    onClick={toggleShow}
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

          <LightMode>
            <Button
              colorScheme="blue"
              type="submit"
              w="full"
              mt={8}
              borderRadius="xl"
              size="lg"
              fontSize="md"
              isLoading={isLoading}
            >
              Sign up
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
            Sign up with Google
          </Button>
        </HStack>

        <Text mt={8} color="gray.400" textAlign="center">
          Already a member?{' '}
          <Button variant="link" as={Link} to="/login">
            Sign in
          </Button>
        </Text>
      </Box>
    </Flex>
  );
};
