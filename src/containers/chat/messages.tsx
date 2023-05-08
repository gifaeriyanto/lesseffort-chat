import React from 'react';
import { Box, Flex, Icon } from '@chakra-ui/react';
import { Message, OpenAIModel } from 'api/chat';
import { ChatMessage } from 'components/chat/message';
import { RichEditor } from 'components/richEditor';
import { getUnixTime } from 'date-fns';
import { MdSubdirectoryArrowLeft } from 'react-icons/md';
import { useIndexedDB } from 'react-indexed-db';
import { useChat } from 'store/openai';
import { CustomColor } from 'theme/foundations/colors';

export const ChatMessagesContainer: React.FC = () => {
  const { messages, generatingMessage, streamChatCompletion } = useChat();
  const { newChat, selectedChatId } = useChat();
  const db = useIndexedDB('messages');

  const handleSubmitChat = async (value: string) => {
    if (selectedChatId) {
      await db.add<Message>({
        chatId: selectedChatId,
        content: value,
        role: 'user',
        timestamp: getUnixTime(new Date()),
      });
    } else {
      await newChat({
        bot_id: 1,
        last_message: value,
        model: OpenAIModel.GPT_3_5,
        title: value,
      });
    }
    streamChatCompletion(value);
  };

  return (
    <>
      <Flex
        w="full"
        h="full"
        align="flex-start"
        borderBottom="1px solid"
        borderColor={CustomColor.border}
        overflow="auto"
        my={4}
        direction="column-reverse"
      >
        {!!generatingMessage && <ChatMessage message={generatingMessage} />}
        {messages.map((message) => (
          <ChatMessage
            key={message.timestamp}
            isMe={message.role === 'user'}
            message={message.content}
          />
        ))}
      </Flex>

      <Flex
        p={2}
        pr={6}
        bgColor={CustomColor.card}
        borderRadius="2xl"
        border="1px solid"
        borderColor={CustomColor.border}
        align="center"
        justify="center"
      >
        <Box w="full">
          <RichEditor onSubmit={handleSubmitChat} />
        </Box>
        <Icon
          as={MdSubdirectoryArrowLeft}
          fontSize="2xl"
          color="gray.400"
          title="Press enter to submit"
        />
      </Flex>
    </>
  );
};
