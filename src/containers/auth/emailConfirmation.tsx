import React, { useLayoutEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Tag,
  Text,
  useBoolean,
} from '@chakra-ui/react';
import { TbSend } from 'react-icons/tb';
import { useParams, useSearchParams } from 'react-router-dom';
import { supabase } from 'store/supabase';
import { resendEmailConfirmation } from 'store/supabase/auth';
import { CustomColor } from 'theme/foundations/colors';

const COUNT_DOWN_SECONDS = 30;

export const EmailConfirmationContainer: React.FC = () => {
  const [showButton, setShowButton] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>();
  const [remainingTime, setRemainingTime] = useState(COUNT_DOWN_SECONDS);
  const [params] = useSearchParams();
  const [isLoading, { on, off }] = useBoolean();

  const email = useMemo(() => {
    return params.get('email')?.replace(/ /g, '+') || '';
  }, [params]);

  const startTimer = () => {
    const _intervalId = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);
    setIntervalId(_intervalId);
    return _intervalId;
  };

  useLayoutEffect(() => {
    const _intervalId = startTimer();

    return () => {
      clearInterval(_intervalId);
    };
  }, []);

  useLayoutEffect(() => {
    if (remainingTime <= 0) {
      clearInterval(intervalId);
      setShowButton(true);
    }
  }, [remainingTime]);

  const handleResend = () => {
    if (email) {
      on();
      resendEmailConfirmation(email).finally(off);
    }
    setRemainingTime(COUNT_DOWN_SECONDS);
    startTimer();
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
        <Flex justify="center" mb={8}>
          <Flex
            bgColor="blue.500"
            w="5rem"
            h="5rem"
            borderRadius="full"
            align="center"
            justify="center"
          >
            <Icon as={TbSend} fontSize="4xl" />
          </Flex>
        </Flex>

        <Heading mb={4} textAlign="center">
          <Text as="span" color="blue.500">
            Thank{' '}
          </Text>
          you!
        </Heading>

        <Text textAlign="center">
          A confirmation letter has been sent to{' '}
          {email ? (
            <Text color="blue.500" as="span">
              {email}
            </Text>
          ) : (
            'your email'
          )}
          . Please check your inbox.
        </Text>

        <Text
          borderTop="1px solid"
          borderColor={CustomColor.border}
          mt={4}
          pt={4}
          textAlign="center"
        >
          If you not got any mail,{' '}
          <Button
            isDisabled={!!remainingTime}
            onClick={handleResend}
            mt={2}
            isLoading={isLoading}
          >
            {remainingTime <= 0 && (
              <Tag mr={2} borderRadius="xl">
                {remainingTime}
              </Tag>
            )}
            <Text as="span">Resend email confirmation</Text>
          </Button>
        </Text>
      </Box>
    </Flex>
  );
};
