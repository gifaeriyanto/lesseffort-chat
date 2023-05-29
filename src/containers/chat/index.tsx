import React, { useLayoutEffect } from 'react';
import {
  Button,
  Grid,
  GridItem,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react';
import { Chat } from 'components/chat';
import { ChatSidebar } from 'components/chat/sidebar';
import { useForm } from 'react-hook-form';
import { useChat } from 'store/chat';
import { usePWA } from 'store/pwa';
import { useProfilePhoto, useUserData } from 'store/user';
import { shallow } from 'zustand/shallow';

export const ChatContainer: React.FC = () => {
  const {
    isOpen: isOpenAPIKEYModal,
    onOpen: onOpenAPIKEYModal,
    onClose: onCloseAPIKEYModal,
  } = useDisclosure();
  const { register, handleSubmit } = useForm();
  const { getPWAStatus } = usePWA();
  const setSelectedChatId = useChat(
    (state) => state.setSelectedChatId,
    shallow,
  );
  const { getPhoto } = useProfilePhoto();
  const { user, isFreeUser } = useUserData();
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
      <Grid
        templateColumns={{ base: '1fr', md: '18.75rem 1fr' }}
        gap={{ base: 0, md: 4 }}
        p={{ base: 0, md: 4 }}
      >
        <GridItem>
          <ChatSidebar />
        </GridItem>

        <GridItem>
          <Chat />
        </GridItem>
      </Grid>

      <Modal isOpen={isOpenAPIKEYModal} onClose={() => {}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Input OPENAI Key</ModalHeader>
          <form onSubmit={handleSubmit(handleSaveOpenaiKey)}>
            <ModalBody>
              <Input {...register('openaiKey')} />
            </ModalBody>

            <ModalFooter>
              <Button type="submit" variant="ghost">
                Save
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
