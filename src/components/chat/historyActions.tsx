import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
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
import { accentColor } from 'theme/foundations/colors';
import { formatDateFromTimestamp } from 'utils/common';
import { shallow } from 'zustand/shallow';

export interface HistoryActionsProps
  extends Partial<Omit<IconButtonProps, 'id'>> {
  id?: number;
}

interface FormInputs {
  title: string;
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
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormInputs>();
  const { selectedChat, deleteChat, renameChat } = useChat((state) => {
    const selectedChat = state.chatHistory.find((item) => item.id === id);
    return {
      renameChat: state.renameChat,
      chatHistoryCount: state.chatHistory.length,
      selectedChat,
      deleteChat: state.deleteChat,
    };
  }, shallow);

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
          _light={{
            bgColor: 'gray.200',
          }}
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
              <FormControl isInvalid={!!errors.title}>
                <FormLabel>Chat title</FormLabel>
                <Input
                  defaultValue={selectedChat?.title}
                  {...register('title', {
                    required: {
                      message: 'Chat title cannot be empty',
                      value: true,
                    },
                  })}
                />
                {errors.title && (
                  <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                )}
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme={accentColor()} mr={3} type="submit">
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
              {selectedChat?.bot_instruction && (
                <Box>
                  <Box color="gray.400" fontSize="sm">
                    System Instruction
                  </Box>
                  <Box>{selectedChat?.bot_instruction}</Box>
                </Box>
              )}
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
