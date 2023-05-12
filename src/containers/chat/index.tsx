import React, { useEffect } from 'react';
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
  useDisclosure,
} from '@chakra-ui/react';
import { Chat } from 'components/chat';
import { ChatSidebar } from 'components/chat/sidebar';
import { useForm } from 'react-hook-form';
import { usePWA } from 'store/pwa';

const ChatContainer: React.FC = () => {
  const {
    isOpen: isOpenAPIKEYModal,
    onOpen: onOpenAPIKEYModal,
    onClose: onCloseAPIKEYModal,
  } = useDisclosure();
  const { register, handleSubmit } = useForm();
  const { getPWAStatus } = usePWA();

  useEffect(() => {
    getPWAStatus();
    if (!localStorage.getItem('OPENAI_KEY')) {
      onOpenAPIKEYModal();
    }
  }, []);

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

export default ChatContainer;
