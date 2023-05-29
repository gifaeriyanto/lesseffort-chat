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
import { useChat } from 'store/openai';
import { usePWA } from 'store/pwa';
import { supabase } from 'store/supabase';
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
  const { setPhoto } = useProfilePhoto();
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
    supabase.auth.getSession().then(async (res) => {
      const avatar = res.data.session?.user?.user_metadata?.avatar_url || null;
      // todo: currently this is not working because missing the file extension
      // if (res.data.session?.user.app_metadata.provider === 'google') {
      //   avatar = await getFileUrl(user.id);
      // }
      setPhoto(avatar);
    });
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
