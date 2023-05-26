import React, { useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Container,
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
  VStack,
} from '@chakra-ui/react';
import { SimpleNavbar } from 'components/navbar/simple';
import { Plan, PricingPlans } from 'components/pricingPlans';
import { ComparePlans } from 'components/pricingPlans/comparePlans';
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
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>(undefined);

  const toggleShow = () => setShow(!show);

  const handleSubmitLogin = (params: SignUpParams) => {
    signUp(params).then((res) => {
      if (res.error?.message) {
        standaloneToast({
          title: 'Error login',
          description: res.error.message,
          position: 'top',
          status: 'error',
        });
      }
    });
  };

  if (!selectedPlan) {
    return (
      <Flex minH="100vh" justify="center">
        <Box pb="8rem">
          <SimpleNavbar backLink="/login" />
          <Heading mt="3rem" textAlign="center">
            Pricing{' '}
            <Text as="span" color="blue.500">
              Plans
            </Text>
          </Heading>
          <PricingPlans onSelect={setSelectedPlan} />
          <Heading my="3rem" textAlign="center">
            Compare{' '}
            <Text as="span" color="blue.500">
              Plans
            </Text>
          </Heading>
          <ComparePlans />
        </Box>
      </Flex>
    );
  }

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
        <Heading mb={2} textAlign="center">
          Sign Up
        </Heading>

        <Text mb={8} color="gray.400" textAlign="center">
          <Text as="span" fontWeight="bold" color="blue.500">
            {selectedPlan}
          </Text>{' '}
          plan selected.{' '}
          <Button variant="link" onClick={() => setSelectedPlan(undefined)}>
            Change plan
          </Button>
        </Text>

        <form onSubmit={handleSubmit(handleSubmitLogin)}>
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
