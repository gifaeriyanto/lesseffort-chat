import React, { useLayoutEffect, useMemo, useState } from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  Link,
  Text,
  useBoolean,
  useColorMode,
} from '@chakra-ui/react';
import { ChatMessagePreview } from 'components/chat/preview/message';
import { ProfilePhotoPreview } from 'components/chat/preview/profilePhoto';
import { reverse } from 'ramda';
import { TbMoonFilled, TbSun } from 'react-icons/tb';
import { useParams } from 'react-router-dom';
import { getSharedConversation, SharedConversation } from 'store/supabase/chat';

export const SharedConversationContainer: React.FC = () => {
  const [conversation, setConversation] = useState<
    SharedConversation | undefined
  >(undefined);
  const params = useParams<{ sharedId: string }>();
  const [isLoading, { on, off }] = useBoolean();
  const { toggleColorMode, colorMode } = useColorMode();

  const accentColor = useMemo(() => {
    if (conversation) {
      return conversation.color_scheme;
    }
    return 'blue';
  }, [conversation]);

  useLayoutEffect(() => {
    if (!isLoading && params.sharedId) {
      on();
      getSharedConversation(params.sharedId).then(setConversation).finally(off);
    }
  }, [params.sharedId]);

  if (!conversation) {
    return null;
  }

  return (
    <Container maxW="container.lg" py={8}>
      <Flex justify="space-between">
        <Heading>{conversation.title}</Heading>

        <IconButton
          variant="ghost"
          icon={colorMode === 'light' ? <TbMoonFilled /> : <TbSun />}
          aria-label="Toggle color mode"
          onClick={toggleColorMode}
          color="gray.400"
          borderRadius="full"
        />
      </Flex>

      <Box mb={8} mt={4}>
        <Box color="gray.400" fontSize="sm">
          Author
        </Box>
        <Box>{conversation.user_name}</Box>
      </Box>

      <Box minH="60vh">
        {reverse(conversation.content).map((item) => (
          <ChatMessagePreview
            key={item.id}
            message={item}
            photo={conversation.user_avatar || ''}
            accentColor={accentColor}
          />
        ))}
      </Box>

      <Flex justify="center" mt={12} pt={4}>
        <Flex
          gap={4}
          align="center"
          as={Link}
          href="/"
          _hover={{ textDecor: 'none' }}
        >
          <Box as="img" src="/favicon-32x32.png" h="32px" w="32px" />
          <Box>
            <Text fontSize="sm">Powered by</Text>
            <Text color={`${accentColor}.500`} as="span" fontWeight="bold">
              Less Effort
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Container>
  );
};
