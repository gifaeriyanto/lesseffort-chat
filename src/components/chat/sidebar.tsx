import React, { useLayoutEffect, useMemo, useState } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  IconButton,
  LightMode,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Tag,
  Text,
  useColorMode,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import { getUsages } from 'api/openai';
import { signOut } from 'api/supabase/auth';
import { ChatHistory } from 'components/chat/history';
import { ProfilePhoto } from 'components/chat/profilePhoto';
import { Search } from 'components/search';
import ReactGA from 'react-ga4';
import {
  TbBookmark,
  TbBookmarks,
  TbChecklist,
  TbDiamond,
  TbDiscountCheck,
  TbFlower,
  TbLogout,
  TbMoon,
  TbMoonFilled,
  TbPlus,
  TbSearch,
  TbSettings,
  TbShieldCheck,
  TbSun,
} from 'react-icons/tb';
import { useQuery } from 'react-query';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useChat } from 'store/chat';
import { useSidebar } from 'store/sidebar';
import { useUserData } from 'store/user';
import { accentColor, CustomColor } from 'theme/foundations/colors';
import { useGA } from 'utils/hooks/useGA';
import { toastForFreeUser } from 'utils/toasts';
import { shallow } from 'zustand/shallow';

export const ChatSidebar: React.FC = () => {
  const isFreeUser = useUserData((state) => state.isFreeUser, shallow);
  const { GAEvent } = useGA();
  const { isOpenSidebar, onCloseSidebar } = useSidebar(
    (state) => ({
      isOpenSidebar: state.isOpen,
      onCloseSidebar: state.onClose,
    }),
    shallow,
  );
  const { isOpen: isShowSearch, onToggle } = useDisclosure();
  const [isLessThanMd] = useMediaQuery('(max-width: 48em)');
  const {
    richEditorRef,
    getChatHistory,
    reset,
    resetChatSettings,
    setSelectedChatId,
  } = useChat(
    (state) => ({
      richEditorRef: state.richEditorRef,
      getChatHistory: state.getChatHistory,
      reset: state.reset,
      resetChatSettings: state.resetChatSettings,
      setSelectedChatId: state.setSelectedChatId,
    }),
    shallow,
  );
  const [search, setSearch] = useState('');
  const { toggleColorMode, colorMode } = useColorMode();
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = useQuery('usages', getUsages, {
    refetchInterval: 60000 * 5, // 5 min
  });

  const usages = useMemo(() => {
    if (!data) {
      return {
        total: 0,
        today: 0,
      };
    }
    return data;
  }, [data]);

  const handleToggleShowSearch = () => {
    if (isFreeUser) {
      toastForFreeUser(
        'search_history_limit',
        'Upgrade your plan to access search chat history!',
      );
      return;
    }

    onToggle();
  };

  const handleToggleColorMode = () => {
    toggleColorMode();
    GAEvent({
      action: `Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`,
      category: 'UX',
      label: isLessThanMd ? 'mobile' : 'desktop',
    });
  };

  useLayoutEffect(() => {
    getChatHistory();
  }, []);

  useLayoutEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        getChatHistory();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleNewChat = () => {
    if (location.pathname !== '/') {
      navigate('/');
    }
    localStorage.removeItem('lastOpenChatId');
    reset();
    resetChatSettings();
    onCloseSidebar();
    richEditorRef?.current?.focus();
  };

  const openSavedMessages = () => {
    if (isFreeUser) {
      toastForFreeUser('saved_messages_limit');
      return;
    }
    localStorage.setItem('lastOpenChatId', '-1');
    setSelectedChatId(-1);
    navigate('/');
  };

  const handleGoToSharedConversationList = () => {
    if (isFreeUser) {
      toastForFreeUser('share_conversation_limit');
    } else {
      navigate('/shared');
    }
  };

  const renderUserSettings = () => {
    return (
      <Menu autoSelect={false}>
        <MenuButton>
          <ProfilePhoto
            border="3px solid"
            color={accentColor('500')}
            _light={{ bgColor: 'gray.200' }}
          />
        </MenuButton>
        <MenuList fontWeight="normal">
          <MenuItem onClick={openSavedMessages}>
            <Icon as={TbBookmark} />
            <Text ml={4}>Saved messages</Text>
          </MenuItem>
          <MenuItem onClick={handleGoToSharedConversationList}>
            <Icon as={TbBookmarks} />
            <Text ml={4}>Saved conversations</Text>
          </MenuItem>
          <MenuItem onClick={handleToggleColorMode}>
            {colorMode === 'light' ? <Icon as={TbMoon} /> : <Icon as={TbSun} />}
            <Text ml={4}>
              Switch to {colorMode === 'light' ? 'dark' : 'light'} mode
            </Text>
          </MenuItem>
          <MenuItem as={Link} to="/relax-mode">
            <Icon as={TbFlower} />
            <Text ml={4}>
              Relax mode{' '}
              <LightMode>
                <Tag
                  size="sm"
                  mt={1}
                  ml={2}
                  colorScheme={accentColor()}
                  variant="solid"
                >
                  Beta
                </Tag>
              </LightMode>
            </Text>
          </MenuItem>
          <MenuDivider />
          <MenuItem as={Link} to="/settings">
            <Icon as={TbSettings} />
            <Text ml={4}>Settings</Text>
          </MenuItem>
          {isFreeUser ? (
            <MenuItem as={Link} to="/plans" color={accentColor('500')}>
              <Icon as={TbDiscountCheck} />
              <Text ml={4}>Upgrade to premium</Text>
            </MenuItem>
          ) : (
            <MenuItem as={Link} to="/manage-subs">
              <Icon as={TbDiamond} />
              <Text ml={4}>Manage subscription</Text>
            </MenuItem>
          )}
          <MenuItem as="a" href="https://lesseffort.io/privacy" target="_blank">
            <Icon as={TbShieldCheck} />
            <Text ml={4}>Privacy Policy</Text>
          </MenuItem>
          <MenuItem as="a" href="https://lesseffort.io/terms" target="_blank">
            <Icon as={TbChecklist} />
            <Text ml={4}>Terms of Service</Text>
          </MenuItem>
          <MenuItem onClick={signOut}>
            <Icon as={TbLogout} />
            <Text ml={4}>Log out</Text>
          </MenuItem>
        </MenuList>
      </Menu>
    );
  };

  if (isLessThanMd) {
    return (
      <Drawer isOpen={isOpenSidebar} placement="left" onClose={onCloseSidebar}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader pl="1rem">
            <Flex align="center" justify="space-between">
              <Flex gap={4}>
                <Box as="img" src="/favicon-32x32.png" />
                <Text color={accentColor('500')} as="span" fontWeight="bold">
                  Less Effort
                </Text>
              </Flex>
              <LightMode>
                <IconButton
                  icon={<TbPlus />}
                  aria-label="New chat"
                  colorScheme={accentColor()}
                  fontSize="xl"
                  onClick={handleNewChat}
                  size="sm"
                  borderRadius="full"
                />
              </LightMode>
            </Flex>
          </DrawerHeader>

          <DrawerBody p={0}>
            <Box
              p={2}
              h="3.571rem"
              flexShrink={0}
              onClick={handleToggleShowSearch}
            >
              <Search
                onSearch={isFreeUser ? undefined : setSearch}
                borderRadius="lg"
                isDisabled={isFreeUser}
              />
            </Box>
            <Box
              overflowY="auto"
              h="calc(100% - 9.75rem)"
              className="history-scroll-container"
            >
              <ChatHistory search={search} />
            </Box>
            <Flex
              gap={4}
              p={4}
              borderTop="1px solid"
              borderColor={CustomColor.border}
              _light={{
                borderColor: CustomColor.lightBorder,
              }}
            >
              <Flex justify="space-between" w="full">
                <Flex gap={4}>
                  {renderUserSettings()}
                  <Box>
                    <Text fontWeight="bold">Usages</Text>
                    <Text
                      fontSize="sm"
                      color="gray.300"
                      _light={{ color: 'gray.400' }}
                    >
                      This month:{' '}
                      <Box as="b" color={accentColor('500')}>
                        ${usages.total.toFixed(2)}
                      </Box>
                    </Text>
                  </Box>
                </Flex>

                <IconButton
                  variant="ghost"
                  icon={colorMode === 'light' ? <TbMoonFilled /> : <TbSun />}
                  aria-label="Toggle color mode"
                  onClick={handleToggleColorMode}
                  color="gray.400"
                />
              </Flex>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Flex direction="column" gap={4} h="calc(100vh - 2rem)">
      <LightMode>
        <Box>
          <Button
            colorScheme={accentColor()}
            w="full"
            borderRadius="2xl"
            onClick={handleNewChat}
          >
            <TbPlus />
            <Text ml={2}>New Chat</Text>
          </Button>
        </Box>
      </LightMode>
      <Flex
        h="full"
        bgColor={CustomColor.card}
        borderRadius="2xl"
        border="1px solid"
        borderColor={CustomColor.border}
        overflow="hidden"
        direction="column"
        _light={{
          bgColor: CustomColor.lightCard,
          borderColor: CustomColor.lightBorder,
        }}
      >
        {isShowSearch || search.length ? (
          <Box
            p={2}
            h="3.571rem"
            flexShrink={0}
            borderBottom="1px solid"
            borderColor={CustomColor.border}
            _light={{
              borderColor: CustomColor.lightBorder,
            }}
          >
            <Search
              borderRadius="lg"
              autoFocus
              onBlur={handleToggleShowSearch}
              onSearch={setSearch}
              _light={{
                bgColor: 'gray.200',
                borderColor: CustomColor.lightBorder,
              }}
            />
          </Box>
        ) : (
          <Flex
            h="3.571rem"
            flexShrink={0}
            pr={2}
            pl={4}
            borderBottom="1px solid"
            borderColor={CustomColor.border}
            w="full"
            justify="space-between"
            align="center"
            onClick={handleToggleShowSearch}
            cursor="text"
            _light={{
              borderColor: CustomColor.lightBorder,
            }}
          >
            <Text color="gray.400" fontSize="sm">
              Chat History
            </Text>
            <IconButton
              icon={<TbSearch />}
              aria-label="Search"
              variant="ghost"
              size="sm"
              color="gray.400"
              borderRadius="2xl"
              fontSize="md"
            />
          </Flex>
        )}

        <ChatHistory search={search} />
      </Flex>
      <Accordion allowToggle>
        <AccordionItem
          bgColor={CustomColor.card}
          borderRadius="2xl"
          p={4}
          border="1px solid"
          borderColor={CustomColor.border}
          _light={{
            bgColor: CustomColor.lightCard,
            borderColor: CustomColor.lightBorder,
          }}
        >
          <Flex gap={4}>
            <Flex justify="space-between" align="center" w="full">
              <Flex gap={4}>
                {renderUserSettings()}
                <Box>
                  <Text fontWeight="bold">Usages</Text>
                  <Text
                    fontSize="sm"
                    color="gray.300"
                    _light={{ color: 'gray.400' }}
                  >
                    This month:{' '}
                    <Box as="b" color={accentColor('500')}>
                      ${usages.total.toFixed(2)}
                    </Box>
                  </Text>
                </Box>
              </Flex>
              <HStack>
                <AccordionButton
                  w="auto"
                  p={1}
                  transform="rotate(180deg)"
                  borderRadius="xl"
                >
                  <AccordionIcon color="gray.400" fontSize="2xl" />
                </AccordionButton>
              </HStack>
            </Flex>
          </Flex>
          <AccordionPanel p={0} mt={4}>
            <Box
              pt={4}
              borderTop="1px solid"
              color="gray.300"
              borderColor={CustomColor.border}
              _light={{
                borderColor: CustomColor.lightBorder,
                color: 'gray.400',
              }}
            >
              Today usage is{' '}
              <Box as="b" color={accentColor('500')}>
                ${usages.today.toFixed(4)}
              </Box>
            </Box>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  );
};
