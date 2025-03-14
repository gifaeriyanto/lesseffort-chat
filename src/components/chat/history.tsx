import React, { useMemo } from 'react';
import {
  Box,
  Flex,
  HStack,
  Icon,
  Text,
  Tooltip,
  useMediaQuery,
} from '@chakra-ui/react';
import { Chat } from 'api/chat';
import { HistoryActions } from 'components/chat/historyActions';
import { sort } from 'ramda';
import { RiWifiOffLine } from 'react-icons/ri';
import { TbAlertCircle, TbLock } from 'react-icons/tb';
import { useLocation, useNavigate } from 'react-router-dom';
// import LazyLoad from 'react-lazyload';
import { useChat } from 'store/chat';
import { useSidebar } from 'store/sidebar';
import { useUserData } from 'store/user';
import { accentColor, CustomColor } from 'theme/foundations/colors';
import { useOnlineStatus } from 'utils/hooks/useOnlineStatus';
import { toastForFreeUser } from 'utils/toasts';
import { shallow } from 'zustand/shallow';

export interface ChatHistoryItemProps {
  id?: number;
  isActive?: boolean;
  title: string;
  description: string;
  isLimited?: boolean;
  isLocked?: boolean;
  onSelect: (id: number) => void;
}

export const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({
  id,
  isActive,
  title,
  description,
  isLimited,
  isLocked,
  onSelect,
}) => {
  const [isLessThanMd] = useMediaQuery('(max-width: 48em)');

  const handleSelect = () => {
    if (isLocked) {
      toastForFreeUser(
        'chat_history_limit',
        'Upgrade your plan to view more chat history!',
        `You're currently on the free plan, which only allows you to view up to 5 chat histories. To view more, please upgrade to our premium plan.`,
      );
      return;
    }

    if (id) {
      onSelect(id);
    }
  };

  return (
    <Box
      borderLeft={isActive ? '1px solid' : undefined}
      borderColor={accentColor('500')}
      borderBottom={`1px solid ${CustomColor.border}`}
      bgColor={isActive ? 'gray.700' : 'transparent'}
      w="full"
      h="5.125rem"
      p={4}
      pl={isActive ? 'calc(1rem - 1px)' : 4}
      role="button"
      onClick={handleSelect}
      pos="relative"
      _light={{
        bgColor: isActive ? 'gray.200' : 'transparent',
        borderBottom: `1px solid ${CustomColor.lightBorder}`,
      }}
    >
      <HStack
        _hover={{
          '& > .history-actions': {
            opacity: '1',
          },
        }}
        justify="space-between"
      >
        <Box flexGrow={0} overflow="hidden">
          <Text isTruncated fontWeight={isActive ? '600' : '500'}>
            {isLocked && (
              <Box as="span">
                <Icon as={TbLock} color="gray.400" mr={2} />
              </Box>
            )}
            {isLimited && (
              <Tooltip label="Context length exceeded" hidden={isLocked}>
                <Box as="span">
                  <Icon as={TbAlertCircle} color="gray.400" mr={2} />
                </Box>
              </Tooltip>
            )}
            {title}
          </Text>
          <Text fontSize="sm" color="gray.400" isTruncated>
            {description || 'No messages yet'}
          </Text>
        </Box>
        <Box
          onClick={(e) => e.stopPropagation()}
          className="history-actions"
          pos="absolute"
          right="0.5rem"
          opacity={0}
          hidden={isLessThanMd}
        >
          <HistoryActions id={id} />
        </Box>
      </HStack>
    </Box>
  );
};

export interface ChatHistoryProps {
  search: string;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ search }) => {
  const { chatHistory, selectedChatId, setSelectedChatId } = useChat(
    (state) => ({
      chatHistory: state.chatHistory,
      selectedChatId: state.selectedChatId,
      setSelectedChatId: state.setSelectedChatId,
    }),
    shallow,
  );
  const onCloseSidebar = useSidebar((state) => state.onClose, shallow);
  const isFreeUser = useUserData((state) => state.isFreeUser, shallow);
  const location = useLocation();
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();

  const filteredChatHistory = useMemo(() => {
    return sort(
      (a, b) => {
        if (a.updatedAt && b.updatedAt) {
          return b.updatedAt - a.updatedAt;
        } else {
          return (b.id || 0) - (a.id || 0);
        }
      },
      chatHistory.filter((item) => item.title?.match(new RegExp(search, 'i'))),
    ) as Chat[];
  }, [chatHistory, search]);

  const handleSelect = (id: number) => {
    localStorage.setItem('lastOpenChatId', String(id));
    setSelectedChatId(id);
    onCloseSidebar();
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  if (!filteredChatHistory.length) {
    return (
      <Flex
        justify="center"
        align="center"
        h="full"
        color="gray.400"
        p={8}
        textAlign="center"
      >
        You don't have any chat history yet
      </Flex>
    );
  }

  return (
    <Box
      w="full"
      overflow="auto"
      className="history-scroll-container"
      mb="-1px"
    >
      {!isOnline && (
        <Box
          p={4}
          borderBottom="1px solid"
          borderColor={CustomColor.border}
          bgColor="gray.700"
          _light={{
            borderColor: CustomColor.lightBorder,
            bgColor: 'antiquewhite',
          }}
        >
          <Flex
            align="center"
            gap={2}
            color="yellow.500"
            _light={{ color: 'yellow.600' }}
          >
            <Icon as={RiWifiOffLine} />
            <Text>Computer not connected</Text>
          </Flex>
          <Text fontSize="sm" color="gray.400">
            Make sure your computer has an active internet connection.
          </Text>
        </Box>
      )}
      {filteredChatHistory.map((item, index) => (
        // <LazyLoad
        //   key={item.id || index}
        //   height="5.125rem"
        //   scrollContainer=".history-scroll-container"
        //   offset={200}
        // >
        <ChatHistoryItem
          key={item.id || index}
          id={item.id}
          title={item.title}
          description={item.last_message.replace(/[^\w\s]/g, '')}
          onSelect={handleSelect}
          isActive={selectedChatId === item.id}
          isLimited={item.limited}
          isLocked={isFreeUser && index > 4}
        />
        // </LazyLoad>
      ))}
    </Box>
  );
};
