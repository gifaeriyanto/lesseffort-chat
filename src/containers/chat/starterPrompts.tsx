import React, { useLayoutEffect, useMemo, useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Icon,
  IconButton,
  LightMode,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Select,
  Skeleton,
  Tab,
  TabList,
  Tabs,
  Tag,
  Text,
  useBoolean,
  useColorMode,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { captureException } from '@sentry/react';
import {
  defaultOrder,
  deletePrompt,
  favoritePrompt,
  getPage,
  getPrompts,
  getPromptsCount,
  PromptData,
  PromptGroup,
} from 'api/supabase/prompts';
import { ChatMessageAction } from 'components/chat/message';
import { Empty } from 'components/empty';
import { Search } from 'components/search';
import { CreatePrompt } from 'containers/chat/createPrompt';
import {
  TbChevronDown,
  TbFilter,
  TbPencil,
  TbStar,
  TbStarFilled,
  TbTemplate,
  TbTrash,
} from 'react-icons/tb';
import { useMutation, useQuery } from 'react-query';
import { usePrompts } from 'store/prompt';
import { useUserData } from 'store/user';
import { accentColor, CustomColor } from 'theme/foundations/colors';
import {
  capitalizeWords,
  createIncrementArray,
  formatLocaleNumber,
  formatNumber,
  uppercaseFirstLetter,
} from 'utils/common';
import { compareObjects } from 'utils/object';
import { toastForFreeUser } from 'utils/toasts';
import { shallow } from 'zustand/shallow';

export enum PromptCategory {
  'consultant' = 'Consultant',
  'copywriting' = 'Copywriting',
  'generator' = 'Generator',
  'marketing' = 'Marketing',
  'productivity' = 'Productivity',
  'softwareEngineering' = 'Software Engineering',
  'other' = 'Other',
}

export interface StarterPromptsProps {
  onSelectPrompt?: (prompt: PromptData) => void;
  onManagePrompt?: (value: boolean) => void;
}

const listOfTabs: PromptGroup[] = ['all', 'yours', 'favorites'];

export const StarterPrompts: React.FC<StarterPromptsProps> = ({
  onSelectPrompt,
}) => {
  const { colorMode } = useColorMode();
  const [keyword, setKeyword] = useState('');
  const [order, setOrder] = useState(defaultOrder);
  const [category, setCategory] = useState('');
  const [visibility, setVisibility] = useState('');
  const [showOwnOnly, { on: enableOwnOnly, off: disableOwnOnly }] =
    useBoolean();
  const [activeTab, setActiveTab] = useState<PromptGroup>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingPrompt, setEditingPrompt] = useState<PromptData | undefined>(
    undefined,
  );
  const [deletingPrompt, setDeletingPrompt] = useState<PromptData | undefined>(
    undefined,
  );
  const { user, isFreeUser } = useUserData(
    (state) => ({ user: state.user, isFreeUser: state.isFreeUser }),
    shallow,
  );
  const {
    isOpen: isOpenDeleteModal,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();
  const { setIsManagingPrompt } = usePrompts();

  const defaultFilter = {
    order: defaultOrder,
    category: '',
    visibility: '',
  };

  const filterCount = useMemo(() => {
    return compareObjects(defaultFilter, {
      order,
      category,
      visibility,
    });
  }, [order, category, visibility]);

  const clearFilter = () => {
    setOrder(defaultFilter.order);
    setCategory(defaultFilter.category);
    setVisibility(defaultFilter.visibility);
  };

  useLayoutEffect(() => {
    const lastActiveTab = localStorage.getItem(
      'activePromptTab',
    ) as PromptGroup;
    // to avoid user change the value
    if (listOfTabs.includes(lastActiveTab)) {
      setActiveTab(lastActiveTab);
    }
  }, []);

  useLayoutEffect(() => {
    setIsManagingPrompt(!!(deletingPrompt || editingPrompt));
  }, [deletingPrompt, editingPrompt]);

  const fetchPrompts = () =>
    Promise.all([
      getPrompts({
        page,
        pageSize,
        keyword,
        order,
        category,
        visibility,
        group: activeTab,
      }),
      getPromptsCount({
        keyword,
        category,
        visibility,
        group: activeTab,
      }),
    ]);

  const { data, isLoading, error, refetch } = useQuery(
    `prompts-${page}-${pageSize}-${order}-${keyword}-${category}-${visibility}-${activeTab}`,
    fetchPrompts,
  );

  const { mutate: deletePromptMutate, isLoading: isLoadingDeletePrompt } =
    useMutation('delete-prompt', deletePrompt, {
      onSuccess: () => {
        onCloseDeleteModal();
        refetch();
      },
    });

  useLayoutEffect(() => {
    setPage(1);
  }, [keyword, order, category, visibility, activeTab]);

  const [prompts, count] = useMemo(() => {
    if (!data) {
      return [[], 0];
    }
    return data;
  }, [data]);

  const isLastPage = useMemo(() => {
    const lastPage = Math.ceil(count / pageSize);
    return page >= lastPage;
  }, [prompts, count]);

  const pageFromTo = useMemo(() => {
    const { from, to } = getPage(page, pageSize);
    return {
      from: from + 1,
      to: to + 1,
    };
  }, [page]);

  useLayoutEffect(() => {
    if (error) {
      captureException(error);
    }
  }, [error]);

  const handleDelete = () => {
    if (!deletingPrompt) {
      return;
    }
    deletePromptMutate(deletingPrompt.id);
  };

  const handleFavorite = (id: number, isFavorite: boolean) => {
    if (isFreeUser) {
      toastForFreeUser('favorite_prompt');
      return;
    }
    favoritePrompt(id, isFavorite);
    refetch();
  };

  const handleSwitchTab = (tab: PromptGroup) => {
    if (isFreeUser && tab === 'favorites') {
      toastForFreeUser('favorite_prompt');
      return;
    }
    setActiveTab(tab);
    localStorage.setItem('activePromptTab', tab);
  };

  const renderActions = (prompt: PromptData) => {
    const isYours = prompt.user_id === user?.id;

    return (
      <HStack>
        <IconButton
          icon={prompt.is_favorite ? <TbStarFilled /> : <TbStar />}
          aria-label="Favorite"
          variant="ghost"
          color={prompt.is_favorite ? 'yellow.500' : 'gray.400'}
          fontSize="md"
          size="xs"
          onClick={(e) => {
            e.stopPropagation();
            handleFavorite(prompt.id, prompt.is_favorite);
          }}
        />
        {isYours && (
          <Menu autoSelect={false}>
            <MenuButton
              as={IconButton}
              icon={<TbChevronDown />}
              aria-label="Action menu"
              variant="ghost"
              color="gray.400"
              fontSize="lg"
              size="xs"
              onClick={(e) => e.stopPropagation()}
            />
            <Portal>
              <MenuList
                fontWeight="normal"
                onClick={(e) => e.stopPropagation()}
              >
                <MenuItem isDisabled>
                  <Text fontSize="sm">Only you can take this action</Text>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setEditingPrompt(prompt);
                  }}
                >
                  <Icon as={TbPencil} />
                  <Text ml={4}>Edit prompt</Text>
                </MenuItem>
                <MenuItem
                  color="red.400"
                  onClick={() => {
                    setDeletingPrompt(prompt);
                    onOpenDeleteModal();
                  }}
                >
                  <Icon as={TbTrash} />
                  <Text ml={4}>Delete prompt</Text>
                </MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        )}
      </HStack>
    );
  };

  const renderStatus = (status: PromptData['status']) => {
    switch (status) {
      case 'pending':
        return (
          <Tag colorScheme="red" size="sm">
            {uppercaseFirstLetter(status)}
          </Tag>
        );

      case 'private':
        return (
          <Tag colorScheme={accentColor()} size="sm">
            {uppercaseFirstLetter(status)}
          </Tag>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Flex
        justify="space-between"
        align={{ base: 'flex-start', md: 'center' }}
        direction={{ base: 'column', md: 'row' }}
        gap={4}
      >
        <Box>
          <Flex fontSize="xl" fontWeight="bold" align="center" gap={1}>
            <Text color={accentColor('500')} as="span">
              Starter
            </Text>
            <Text>Prompts</Text>
          </Flex>
          <Box fontSize="sm" color="gray.400">
            {!!count ? (
              <>
                <Box as="b" color="gray.300" _light={{ color: 'gray.400' }}>
                  {formatLocaleNumber(count)}
                </Box>{' '}
                {keyword ? 'prompts match your filter' : 'available prompts'}
              </>
            ) : isLoading ? (
              'Fetching data...'
            ) : (
              'No available prompts'
            )}
          </Box>
        </Box>
        <Flex gap={4} w={{ base: 'full', md: 'auto' }}>
          <CreatePrompt
            onSuccess={refetch}
            defaultValue={editingPrompt}
            onCloseModal={() => setEditingPrompt(undefined)}
          />
          <Popover closeOnBlur>
            <PopoverTrigger>
              <ChatMessageAction
                icon={
                  filterCount ? (
                    <>
                      <TbFilter />
                      <Tag ml={2} borderRadius="0.4rem">
                        {filterCount}
                      </Tag>
                    </>
                  ) : (
                    <TbFilter />
                  )
                }
                w={filterCount ? '4rem' : 'auto'}
                title="Filter"
                size="md"
                borderRadius="xl"
                variant="outline"
                _light={{
                  borderColor: CustomColor.lightBorder,
                  bgColor: 'gray.100',
                  color: 'gray.500',
                }}
              />
            </PopoverTrigger>
            <PopoverContent borderRadius="xl">
              <PopoverArrow />
              <PopoverBody pb={4}>
                <VStack spacing={4} align="flex-end">
                  <FormControl>
                    <FormLabel fontSize="sm">Sort by</FormLabel>
                    <Select
                      onChange={(e) => setOrder(e.currentTarget.value)}
                      value={order}
                    >
                      <option value="usages">Top usage</option>
                      <option value="usages_last_week">
                        Top usage (weekly)
                      </option>
                      <option value="created_at">Latest updates</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Category</FormLabel>
                    <Select
                      onChange={(e) => setCategory(e.currentTarget.value)}
                      value={category}
                    >
                      <option value="">All</option>
                      {Object.values(PromptCategory).map((value) => (
                        <option value={value} key={value}>
                          {value}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Visibility</FormLabel>
                    <Select
                      onChange={(e) => setVisibility(e.currentTarget.value)}
                      value={visibility}
                    >
                      <option value="">All</option>
                      <option value="public">Public</option>
                      <option value="pending">Pending</option>
                      <option value="private">Private</option>
                    </Select>
                  </FormControl>
                  <Button size="sm" onClick={clearFilter} hidden={!filterCount}>
                    Clear filter
                  </Button>
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <Box w={{ base: 'full', md: 'auto' }}>
            <Search onSearch={setKeyword} borderRadius="xl" />
          </Box>
        </Flex>
      </Flex>

      <Tabs
        mt={4}
        align="center"
        colorScheme={accentColor()}
        index={listOfTabs.findIndex((item) => item === activeTab)}
      >
        <LightMode>
          <TabList
            borderColor={
              colorMode === 'light' ? CustomColor.lightBorder : 'inherit'
            }
            _active={{
              button: {
                bgColor: 'transparent',
              },
            }}
            sx={{
              button: {
                color: 'gray.400',
                _selected: {
                  fontWeight: 'bold',
                  color: colorMode === 'light' ? 'gray.500' : 'gray.200',
                  borderColor: accentColor('500'),
                },
              },
            }}
          >
            {listOfTabs.map((item) => (
              <Tab
                key={item}
                fontSize="sm"
                onClick={() => handleSwitchTab(item)}
              >
                {capitalizeWords(item)}
              </Tab>
            ))}
          </TabList>
        </LightMode>
      </Tabs>

      <Empty
        hidden={
          isLoading ||
          !!prompts.filter((item) => item.title.match(new RegExp(keyword, 'i')))
            .length
        }
        message="No prompts match your filter"
        h={{ base: 'calc(100vh - 470px)', md: 'calc(100vh - 350px)' }}
      />

      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4} mt={4}>
        {isLoading ? (
          <>
            {createIncrementArray(4).map((item) => (
              <GridItem
                key={item}
                border="1px solid"
                borderColor={CustomColor.border}
                p={4}
                h="full"
                borderRadius="xl"
                _light={{
                  borderColor: CustomColor.lightBorder,
                }}
              >
                <VStack spacing={4} align="flex-start">
                  <Skeleton height="1.2rem" w="80%" />
                  <Skeleton height="0.8rem" w="40%" />
                </VStack>
                <VStack spacing={4} align="flex-start" mt={8}>
                  <Skeleton height="0.8rem" w="100%" />
                  <Skeleton height="0.8rem" w="100%" />
                  <Skeleton height="0.8rem" w="70%" />
                </VStack>
                <HStack mt={6}>
                  <Skeleton height="0.8rem" w="20%" />
                  <Skeleton height="0.8rem" w="20%" />
                </HStack>
              </GridItem>
            ))}
          </>
        ) : (
          <>
            {prompts
              .filter((item) => item.title.match(new RegExp(keyword, 'i')))
              .map((item) => (
                <GridItem key={item.id}>
                  <Flex
                    border="1px solid"
                    borderColor={CustomColor.border}
                    p={4}
                    h="full"
                    borderRadius="xl"
                    direction="column"
                    role="button"
                    _hover={{
                      bgColor: 'gray.600',
                      _light: {
                        bgColor: 'gray.100',
                      },
                    }}
                    onClick={() => onSelectPrompt?.(item)}
                    _light={{
                      bgColor: 'gray.100',
                      borderColor: CustomColor.lightBorder,
                    }}
                  >
                    <Flex justify="space-between" align="baseline">
                      <Box fontWeight="bold" fontSize="lg">
                        {item.title}
                      </Box>
                      {renderActions(item)}
                    </Flex>
                    <Box fontSize="sm" color="gray.400" mb={4}>
                      {item.category} . by{' '}
                      {item.link ? (
                        <Link href={item.link} target="_blank">
                          {item.author_name}
                        </Link>
                      ) : (
                        item.author_name
                      )}
                    </Box>
                    <Box
                      fontSize="sm"
                      color="gray.300"
                      fontStyle="italic"
                      _light={{ color: 'gray.400' }}
                    >
                      {item.description}
                    </Box>

                    <Flex
                      justify="space-between"
                      fontSize="sm"
                      color="gray.300"
                      mt="auto"
                      pt={4}
                      _light={{ color: 'gray.400' }}
                    >
                      <Box>
                        {item.usages ? formatNumber(item.usages) : 'Never'} used
                      </Box>

                      <Box>{renderStatus(item.status)}</Box>
                    </Flex>
                  </Flex>
                </GridItem>
              ))}
          </>
        )}
      </Grid>

      <Flex
        borderRadius="xl"
        border="1px solid"
        borderColor={CustomColor.border}
        mt={4}
        p={4}
        justify="space-between"
        fontSize="sm"
        align="center"
        hidden={count <= pageSize && page === 1}
        _light={{
          borderColor: CustomColor.lightBorder,
        }}
      >
        <Box pl={2} color="gray.400">
          {pageFromTo.from === pageFromTo.to || pageFromTo.to > count ? (
            <>
              Results: {formatLocaleNumber(count)} of{' '}
              {formatLocaleNumber(count)}
            </>
          ) : (
            <>
              Results: {formatLocaleNumber(pageFromTo.from)} -{' '}
              {formatLocaleNumber(pageFromTo.to)} of {formatLocaleNumber(count)}
            </>
          )}
        </Box>
        <ButtonGroup size="sm" variant="outline">
          <Button
            onClick={() => setPage((prev) => prev - 1)}
            isDisabled={page <= 1}
          >
            Prev
          </Button>
          <Button
            onClick={() => setPage((prev) => prev + 1)}
            isDisabled={isLastPage}
          >
            Next
          </Button>
        </ButtonGroup>
      </Flex>

      <Modal isOpen={isOpenDeleteModal} onClose={onCloseDeleteModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete prompt</ModalHeader>
          <ModalBody>
            <Alert borderRadius="xl" mb={4} status="error" fontSize="sm">
              <AlertIcon alignSelf="baseline" as={TbTemplate} />
              <AlertDescription>{deletingPrompt?.title}</AlertDescription>
            </Alert>
            <Box>
              This action can't be undone. Are you sure you want to delete this
              prompt?
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              onClick={onCloseDeleteModal}
              mr={4}
              isDisabled={isLoadingDeletePrompt}
            >
              Cancel
            </Button>
            <LightMode>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                isLoading={isLoadingDeletePrompt}
              >
                Delete
              </Button>
            </LightMode>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
