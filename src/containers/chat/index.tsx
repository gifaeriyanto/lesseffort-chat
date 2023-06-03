import React, { useLayoutEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Icon,
  Input,
  LightMode,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react';
import { Chat } from 'components/chat';
import { ChatHeader } from 'components/chat/header';
import { ChatSidebar } from 'components/chat/sidebar';
import { MainLayout } from 'components/layout';
import { ChatMessagesContainer } from 'containers/chat/messages';
import Confetti from 'react-confetti';
import { useForm } from 'react-hook-form';
import { TbCircleKeyFilled } from 'react-icons/tb';
import { useChat } from 'store/chat';
import { usePWA } from 'store/pwa';
import { useProfilePhoto, useUserData } from 'store/user';
import { accentColor } from 'theme/foundations/colors';
import { shallow } from 'zustand/shallow';

interface FormInputs {
  openaiKey: string;
}

export const ChatContainer: React.FC = () => {
  const {
    isOpen: isOpenAPIKEYModal,
    onOpen: onOpenAPIKEYModal,
    onClose: onCloseAPIKEYModal,
  } = useDisclosure();
  const {
    isOpen: isOpenPurchasedModal,
    onOpen: onOpenPurchasedModal,
    onClose: onClosePurchasedModal,
  } = useDisclosure();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();
  const { getPWAStatus } = usePWA();
  const setSelectedChatId = useChat(
    (state) => state.setSelectedChatId,
    shallow,
  );
  const { getPhoto } = useProfilePhoto();
  const { isFreeUser, user } = useUserData(
    (state) => ({ isFreeUser: state.isFreeUser, user: state.user }),
    shallow,
  );
  const { toggleColorMode } = useColorMode();

  useLayoutEffect(() => {
    getPWAStatus();

    const lastOpenChatId = Number(localStorage.getItem('lastOpenChatId'));
    if (lastOpenChatId) {
      setSelectedChatId(lastOpenChatId);
    }

    if (!localStorage.getItem('OPENAI_KEY')) {
      onOpenAPIKEYModal();
    }

    if (localStorage.getItem('purchased')) {
      onOpenPurchasedModal();
      localStorage.removeItem('purchased');
    }
  }, []);

  useLayoutEffect(() => {
    if (!user?.id) {
      return;
    }
    getPhoto(user.id);
  }, [user]);

  useLayoutEffect(() => {
    if (isFreeUser) {
      if (localStorage.getItem('chakra-ui-color-mode') === 'dark') {
        toggleColorMode();
      }
      localStorage.setItem('accentColor', 'blue');
    }
  }, [toggleColorMode, isFreeUser]);

  const handleSaveOpenaiKey = ({ openaiKey = '' }) => {
    localStorage.setItem('OPENAI_KEY', openaiKey);
    onCloseAPIKEYModal();
  };

  return (
    <>
      <MainLayout>
        <ChatHeader />
        <ChatMessagesContainer />
      </MainLayout>

      <Modal isOpen={isOpenAPIKEYModal} onClose={onCloseAPIKEYModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex align="center" gap={2}>
              <Icon as={TbCircleKeyFilled} color={accentColor('500')} />
              <Box as="span">Enter API Key</Box>
            </Flex>
          </ModalHeader>
          <form onSubmit={handleSubmit(handleSaveOpenaiKey)}>
            <ModalBody>
              <Text mb={4} fontSize="sm" color="gray.500">
                Your API Key is stored locally on your browser and never sent
                anywhere else.
              </Text>
              <FormControl isInvalid={!!errors['openaiKey']}>
                <FormLabel>OpenAI Key</FormLabel>
                <Input
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
            </ModalBody>

            <ModalFooter>
              <LightMode>
                <Button type="submit" colorScheme={accentColor()}>
                  Save
                </Button>
              </LightMode>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenPurchasedModal} onClose={onClosePurchasedModal}>
        <ModalOverlay />
        <ModalContent>
          <Box pos="fixed" top={0}>
            <Confetti width={400} height={390} />
          </Box>
          <ModalHeader fontWeight="bold">Congratulations 🎉🎉🎉</ModalHeader>

          <ModalBody overflow="hidden">
            You are premium user now, enjoy our premium service.
          </ModalBody>

          <ModalFooter>
            <LightMode>
              <Button
                colorScheme={accentColor()}
                onClick={onClosePurchasedModal}
              >
                Get started
              </Button>
            </LightMode>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
