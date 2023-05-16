import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  IconButtonProps,
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
  Portal,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { TbChevronDown } from 'react-icons/tb';
import { useChat } from 'store/openai';
import { formatDateFromTimestamp } from 'utils/common';

export interface HistoryActionsProps
  extends Partial<Omit<IconButtonProps, 'id'>> {
  id?: number;
}

export const HistoryActions: React.FC<HistoryActionsProps> = ({
  id,
  ...props
}) => {
  const {
    isOpen: isOpenInfoModal,
    onOpen: onOpenInfoModal,
    onClose: onCloseInfoModal,
  } = useDisclosure();
  const {
    isOpen: isOpenRenameModal,
    onOpen: onOpenRenameModal,
    onClose: onCloseRenameModal,
  } = useDisclosure();
  const { register, handleSubmit } = useForm();
  const { selectedChat, deleteChat, renameChat } = useChat((state) => {
    const selectedChat = state.chatHistory.find((item) => item.id === id);
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
    onCloseRenameModal();
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
          bgColor="gray.600"
          _hover={{
            bgColor: 'gray.500',
          }}
          onClick={(e) => e.stopPropagation()}
          {...props}
        />
        <Portal>
          <MenuList>
            <MenuItem onClick={onOpenInfoModal}>Get Info</MenuItem>
            <MenuItem onClick={onOpenRenameModal}>Rename</MenuItem>
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                deleteChat(id);
              }}
            >
              Delete
            </MenuItem>
          </MenuList>
        </Portal>
      </Menu>

      <Modal isOpen={isOpenRenameModal} onClose={onCloseRenameModal}>
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
              <Button onClick={onCloseRenameModal}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenInfoModal} onClose={onCloseInfoModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chat Info</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <VStack w="full" align="flex-start" spacing={4}>
              <Box>
                <Box color="gray.400" fontSize="sm">
                  Title
                </Box>
                <Box>{selectedChat?.title}</Box>
              </Box>
              <Box>
                <Box color="gray.400" fontSize="sm">
                  Model
                </Box>
                <Box>{selectedChat?.model}</Box>
              </Box>
              <Box>
                <Box color="gray.400" fontSize="sm">
                  System Instruction
                </Box>
                <Box>{selectedChat?.bot_instruction}</Box>
              </Box>
              {selectedChat?.createdAt && (
                <Box>
                  <Box color="gray.400" fontSize="sm">
                    Created At
                  </Box>
                  <Box>{formatDateFromTimestamp(selectedChat.createdAt)}</Box>
                </Box>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
