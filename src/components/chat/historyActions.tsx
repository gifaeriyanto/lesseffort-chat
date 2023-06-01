import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  IconButton,
  IconButtonProps,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
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
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { TbChevronDown, TbShare } from 'react-icons/tb';
import { useChat } from 'store/chat';
import { shareConversation } from 'store/supabase/chat';
import { useUserData } from 'store/user';
import { accentColor } from 'theme/foundations/colors';
import { formatDateFromTimestamp } from 'utils/common';
import { toastForFreeUser } from 'utils/toasts';
import { shallow } from 'zustand/shallow';

export interface HistoryActionsProps
  extends Partial<Omit<IconButtonProps, 'id'>> {
  id?: number;
  isHeader?: boolean;
}

interface FormInputs {
  title: string;
}

export const HistoryActions: React.FC<HistoryActionsProps> = ({
  id,
  isHeader,
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
  const { selectedChat, messages, deleteChat, renameChat } = useChat(
    (state) => {
      const selectedChat = state.chatHistory.find((item) => item.id === id);
      return {
        chatHistoryCount: state.chatHistory.length,
        messages: state.messages,
        selectedChat,
        deleteChat: state.deleteChat,
        renameChat: state.renameChat,
      };
    },
    shallow,
  );
  const isFreeUser = useUserData((state) => state.isFreeUser, shallow);

  const handleRename = ({ title: newTitle = '' }) => {
    if (id) {
      renameChat(id, newTitle);
    }
    onCloseRenameModal();
  };

  const handleDelete = () => {
    id && deleteChat(id);
  };

  const handleShareMessage = async () => {
    if (isFreeUser) {
      toastForFreeUser('share_conversation_limit');
    } else {
      const res = await shareConversation(selectedChat?.title || '', messages);
      if (res) {
        window.open(`/shared/${res.uid}`, '_blank');
      }
    }
  };

  const actions = [
    {
      hidden: !isHeader,
      icon: TbShare,
      action: handleShareMessage,
      text: 'Share conversation',
      divider: true,
    },
    {
      action: onOpenInfoModal,
      text: 'Get Info',
    },
    {
      action: onOpenRenameModal,
      text: 'Rename',
    },
    {
      action: handleDelete,
      text: 'Delete',
      color: 'red.400',
    },
  ];

  if (!id) {
    return null;
  }

  return (
    <>
      <Menu autoSelect={false}>
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
            {actions.map((item) => (
              <React.Fragment key={item.text}>
                {!item.hidden && (
                  <>
                    <MenuItem color={item.color} onClick={item.action}>
                      {!!item.icon && <Icon as={item.icon} mr={3} />}
                      <Text>{item.text}</Text>
                    </MenuItem>
                    {item.divider && <MenuDivider />}
                  </>
                )}
              </React.Fragment>
            ))}
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
