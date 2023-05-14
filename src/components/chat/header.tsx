import React from 'react';
import {
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import { TypingDots } from 'components/typingDots';
import { TbBrandOpenai, TbMenu2, TbSearch } from 'react-icons/tb';
import { useChat } from 'store/openai';
import { useSidebar } from 'store/sidebar';
import { CustomColor } from 'theme/foundations/colors';

export const ChatHeader: React.FC = () => {
  const [isLessThanMd] = useMediaQuery('(max-width: 48em)');
  const { isTyping, messagesLength } = useChat((state) => ({
    messagesLength: state.messages.length,
    isTyping: state.isTyping,
  }));
  const { onOpen } = useSidebar();

  return (
    <Flex
      justify="space-between"
      align="center"
      borderBottom="1px solid"
      borderColor={CustomColor.border}
      bgColor={CustomColor.background}
      p={{ base: 4, md: 0 }}
      pb={{ base: 3, md: 2 }}
      w={{ base: 'full', md: 'auto' }}
      pos={{ base: 'fixed', md: 'initial' }}
      zIndex={1}
      top={0}
      left={0}
    >
      {isLessThanMd && (
        <IconButton
          icon={<TbMenu2 />}
          aria-label="Menu"
          variant="ghost"
          fontSize="xl"
          onClick={onOpen}
        />
      )}
      <Flex align="center" gap={4}>
        <Flex
          p={4}
          bgColor="blue.500"
          w="2.188rem"
          h="2.188rem"
          align="center"
          justify="center"
          borderRadius="full"
        >
          <Icon as={TbBrandOpenai} fontSize="2xl" />
        </Flex>
        <Box>
          <Text fontWeight="bold" fontSize="xl" lineHeight="1.2">
            Quick Chat
          </Text>
          <Text fontSize="sm" color="gray.400">
            {messagesLength ? `${messagesLength} messages` : 'No messages'}
          </Text>
        </Box>
      </Flex>
      <HStack>
        <IconButton
          icon={<TbSearch />}
          aria-label="Menu"
          variant="ghost"
          fontSize="xl"
        />
      </HStack>
    </Flex>
  );
};
