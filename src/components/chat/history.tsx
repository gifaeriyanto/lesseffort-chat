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
import { TbAlertCircle } from 'react-icons/tb';
// import LazyLoad from 'react-lazyload';
import { useChat } from 'store/openai';
import { useSidebar } from 'store/sidebar';
import { accentColor, CustomColor } from 'theme/foundations/colors';

export interface ChatHistoryItemProps {
  id?: number;
  isActive?: boolean;
  title: string;
  description: string;
  isLimited?: boolean;
  onDelete: (id: number) => void;
  onSelect: (id: number) => void;
}

export const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({
  id,
  isActive,
  title,
  description,
  isLimited,
  onSelect,
}) => {
  const [isLessThanMd] = useMediaQuery('(max-width: 48em)');

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
      onClick={() => id && onSelect(id)}
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
            {isLimited && (
              <Tooltip label="Context length exceeded">
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
  const { chatHistory, deleteChat, selectedChatId, setSelectedChatId } =
    useChat();
  const { onClose: onCloseSidebar } = useSidebar();

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
          description={item.last_message}
          onDelete={deleteChat}
          onSelect={(id) => {
            setSelectedChatId(id);
            onCloseSidebar();
          }}
          isActive={selectedChatId === item.id}
          isLimited={item.limited}
        />
        // </LazyLoad>
      ))}
    </Box>
  );
};
