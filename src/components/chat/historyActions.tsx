import React from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { TbChevronDown } from 'react-icons/tb';
import { useChat } from 'store/openai';

export interface HistoryActionsProps {
  id?: number;
}

export const HistoryActions: React.FC<HistoryActionsProps> = ({ id }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit } = useForm();
  const { selectedChat, deleteChat, renameChat } = useChat((state) => {
    const selectedChat = state.chatHistory.find(
      (item) => item.id === state.selectedChatId,
    );
    return {
      renameChat: state.renameChat,
      chatHistoryCount: state.chatHistory.length,
      selectedChat,
      deleteChat: state.deleteChat,
    };
  });

  const handleRename = ({ title: newTitle = '' }) => {
    if (id) {
      renameChat(id, newTitle);
    }
    onClose();
  };

  if (!id) {
    return null;
  }

  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<TbChevronDown />}
          aria-label="Action menu"
          variant="ghost"
          color="gray.400"
          fontSize="xl"
          borderRadius="xl"
          size="sm"
          onClick={(e) => e.stopPropagation()}
        />
        <MenuList>
          <MenuItem onClick={onOpen}>Rename</MenuItem>
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              deleteChat(id);
            }}
          >
            Delete
          </MenuItem>
        </MenuList>
      </Menu>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Rename chat</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(handleRename)}>
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Chat title</FormLabel>
                <Input
                  defaultValue={selectedChat?.title}
                  {...register('title')}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
