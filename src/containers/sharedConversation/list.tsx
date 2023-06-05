import React, { useLayoutEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  LightMode,
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
  Tooltip,
  useBoolean,
  useDisclosure,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react';
import { captureException } from '@sentry/react';
import { Empty } from 'components/empty';
import { MainLayout } from 'components/layout';
import { Loading } from 'components/loading';
import MainNavbar from 'components/navbar/main';
import { standaloneToast } from 'index';
import { useForm } from 'react-hook-form';
import { TbChevronDown, TbShare } from 'react-icons/tb';
import {
  deleteSharedConversation,
  getSharedConversationList,
  publishSharedConversation,
  renameSharedConversation,
  SharedConversation,
  unpublishSharedConversation,
} from 'store/supabase/chat';
import { accentColor } from 'theme/foundations/colors';
import { formatDate } from 'utils/common';

interface FormInputs {
  title: string;
}

export const SharedConversationsContainer: React.FC = () => {
  const [isLessThanMd] = useMediaQuery('(max-width: 48em)');
  const [conversations, setConversations] = useState<SharedConversation[]>([]);
  const [count, setCount] = useState(0);
  const {
    isOpen: isOpenDeleteModal,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();
  const [selectedId, setSelectedId] = useState(0);
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
  const [isLoading, { on, off }] = useBoolean(true);

  const handleGetConversations = () => {
    getSharedConversationList()
      .then(setConversations)
      .catch(captureException)
      .finally(off);
  };

  useLayoutEffect(() => {
    setCount(1);
  }, []);

  useLayoutEffect(() => {
    handleGetConversations();
  }, [count]);

  const handleGoToDetail = (id: string) => {
    window.open(`/shared/${id}`);
  };

  const handleAction = (action: Function) => () => {
    action();
    setCount((prev) => prev + 1);
  };

  const handleRename = ({ title: newTitle = '' }) => {
    renameSharedConversation(selectedId, newTitle)
      .then(() => {
        setCount((prev) => prev + 1);
        standaloneToast({
          title: 'Successfully renamed the conversation',
          status: 'success',
        });
      })
      .catch(captureException)
      .finally(onCloseRenameModal);
  };

  const renderSubTitle = () => {
    switch (conversations.length) {
      case 0:
        return 'No conversations';

      case 1:
        return '1 conversation';

      default:
        return `${conversations.length} conversations`;
    }
  };

  const titleTruncate = () => {
    if (isLessThanMd) {
      return {
        isTruncated: true,
        maxW: 'calc(100vw - 10rem)',
      };
    }

    return {};
  };

  const renderActions = (content: SharedConversation) => {
    const actions = [
      {
        hidden: content.status === 'published',
        action: handleAction(() => {
          publishSharedConversation(content.id);
          standaloneToast({
            title: 'Successfully published the conversation',
            status: 'success',
          });
        }),
        text: 'Publish',
        divider: true,
        color: accentColor('500'),
      },
      {
        action: () => {
          setSelectedId(content.id);
          onOpenRenameModal();
        },
        text: 'Rename',
      },
      {
        hidden: content.status === 'pending',
        action: handleAction(() =>
          unpublishSharedConversation(content.id).then(() =>
            standaloneToast({
              title: 'Successfully unpublished the conversation',
              status: 'success',
            }),
          ),
        ),
        text: 'Unpublish',
        color: 'red.400',
      },
      {
        hidden: content.status === 'published',
        action: () => {
          setSelectedId(content.id);
          onOpenDeleteModal();
        },
        text: 'Delete',
        color: 'red.400',
      },
    ];

    return (
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
            bgColor: 'gray.100',
            _hover: {
              bgColor: 'gray.200',
            },
          }}
        />
        <Portal>
          <MenuList>
            {actions.map((item) => (
              <React.Fragment key={item.text}>
                {!item.hidden && (
                  <>
                    <MenuItem
                      color={item.color}
                      onClick={(e) => {
                        e.stopPropagation();
                        item.action();
                      }}
                    >
                      {item.text}
                    </MenuItem>
                    {item.divider && <MenuDivider />}
                  </>
                )}
              </React.Fragment>
            ))}
          </MenuList>
        </Portal>
      </Menu>
    );
  };

  return (
    <>
      <MainLayout>
        <MainNavbar
          title="Shared Conversations"
          icon={TbShare}
          description={renderSubTitle()}
        />

        {isLoading && <Loading />}

        <Empty
          hidden={isLoading && !conversations.length}
          message="You don't have any shared conversation yet"
        />

        <VStack w="full" align="flex-start" mt={{ base: '5rem', md: '2rem' }}>
          {conversations.map((item) => (
            <Flex
              key={item.id}
              bgColor="gray.600"
              p="1rem 2rem"
              pr="1rem"
              borderRadius="xl"
              w="full"
              justify="space-between"
              align="center"
              onClick={() => handleGoToDetail(item.uid)}
              role="button"
              _hover={{ bgColor: 'gray.500' }}
              _light={{
                bgColor: 'gray.100',
              }}
            >
              <Box>
                <Flex align="center">
                  {item.status === 'published' && (
                    <Tooltip label="Published">
                      <Box
                        mr={2}
                        bgColor="green.400"
                        w="10px"
                        h="10px"
                        borderRadius="full"
                      />
                    </Tooltip>
                  )}
                  <Text {...titleTruncate()}>{item.title}</Text>
                </Flex>
                <Box color="gray.400">{item.content.length} messages</Box>
              </Box>
              <HStack spacing={4}>
                <Box
                  color="gray.400"
                  display={{ base: 'none', md: 'block' }}
                  fontSize="sm"
                >
                  {formatDate(new Date(item.created_at as string))}
                </Box>
                {renderActions(item)}
              </HStack>
            </Flex>
          ))}
        </VStack>
      </MainLayout>

      <Modal isOpen={isOpenDeleteModal} onClose={onCloseDeleteModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete shared conversation</ModalHeader>
          <ModalBody>
            This action can't be undone. Are you sure you want to delete this
            shared conversation?
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onCloseDeleteModal} mr={4}>
              Cancel
            </Button>
            <LightMode>
              <Button
                colorScheme="red"
                onClick={handleAction(async () => {
                  await deleteSharedConversation(selectedId);
                  setSelectedId(0);
                  onCloseDeleteModal();
                })}
              >
                Delete
              </Button>
            </LightMode>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenRenameModal} onClose={onCloseRenameModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Rename conversation title</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(handleRename)}>
            <ModalBody pb={6}>
              <FormControl isInvalid={!!errors.title}>
                <FormLabel>Conversation title</FormLabel>
                <Input
                  defaultValue={
                    conversations.find((item) => item.id === selectedId)
                      ?.title || ''
                  }
                  {...register('title', {
                    required: {
                      message: 'Title cannot be empty',
                      value: true,
                    },
                    maxLength: {
                      message: 'Title should be less than 150 characters',
                      value: 150,
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
    </>
  );
};
