import React, { useLayoutEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  LightMode,
  Link,
  Text,
  useBoolean,
  useColorMode,
} from '@chakra-ui/react';
import { getSharedConversation, SharedConversation } from 'api/supabase/chat';
import { ChatMessagePreview } from 'components/chat/preview/message';
import { AccentColorRadio } from 'components/radios/accentColor';
import { reverse } from 'ramda';
import { TbCopy, TbMoon, TbSun } from 'react-icons/tb';
import MetaTags from 'react-meta-tags';
import { useNavigate, useParams } from 'react-router-dom';
import { useChat } from 'store/chat';
import { useUserData } from 'store/user';
import { copyToClipboard } from 'utils/copy';
import { shallow } from 'zustand/shallow';

export const SharedConversationContainer: React.FC = () => {
  const [conversation, setConversation] = useState<
    SharedConversation | undefined
  >(undefined);
  const [showControl, setShowControl] = useState(false);
  const navigate = useNavigate();
  const params = useParams<{ sharedId: string }>();
  const [isLoading, { on, off }] = useBoolean();
  const { toggleColorMode, colorMode } = useColorMode();
  const user = useUserData((state) => state.user, shallow);
  const continueChat = useChat((state) => state.continueChat, shallow);

  const accentColor = useMemo(() => {
    if (conversation) {
      return conversation.color_scheme;
    }
    return 'blue';
  }, [conversation]);

  useLayoutEffect(() => {
    if (
      conversation?.user_id &&
      user?.id === conversation.user_id &&
      conversation.status === 'published'
    ) {
      setShowControl(true);
    }
  }, [user, conversation]);

  useLayoutEffect(() => {
    if (!isLoading && params.sharedId) {
      on();
      getSharedConversation(params.sharedId).then(setConversation).finally(off);
    }
  }, [params.sharedId]);

  const handleCopy = () => {
    copyToClipboard(window.location.href);
  };

  const handleContinueChat = async () => {
    if (!user) {
      navigate('/login', {
        state: {
          redirect: window.location.href,
        },
      });
      return;
    }

    if (!conversation) {
      return;
    }
    const last_message = conversation.content[0].content.slice(0, 150);
    await continueChat(
      { title: conversation.title, last_message },
      reverse(conversation.content),
    );
    navigate('/');
  };

  if (conversation === undefined) {
    return null;
  }

  if (conversation === null) {
    return (
      <Flex h="100vh" w="100vw" align="center" justify="center">
        The conversation could not be found or it has been removed.
      </Flex>
    );
  }

  return (
    <>
      <MetaTags>
        <title>{conversation.title}</title>
        <meta
          name="description"
          content={
            conversation.content?.[0]?.content ||
            `Shared conversation from ${conversation.user_name} with AI`
          }
        />
        <meta property="og:title" content={conversation.title} />
      </MetaTags>

      {showControl && conversation.status === 'published' && (
        <Box
          fontSize="xs"
          bgColor="gray.500"
          textAlign="center"
          py={2}
          _light={{ bgColor: 'gray.100' }}
        >
          This conversation is visible to everyone who has the link.
        </Box>
      )}

      <Container maxW="container.lg" py={8}>
        <Heading
          fontSize={{ base: '2xl', md: '4xl' }}
          display="-webkit-box"
          overflow="hidden"
          title={conversation.title}
          sx={{
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
          }}
        >
          {conversation.title}
        </Heading>

        <Flex justify="space-between" align="center" mb={8} mt={4}>
          <Box>
            <Box color="gray.400" fontSize="sm">
              Author
            </Box>
            {conversation.user_link ? (
              <Link href={conversation.user_link} target="_blank">
                <Box>{conversation.user_name}</Box>
              </Link>
            ) : (
              <Box>{conversation.user_name}</Box>
            )}
          </Box>

          <HStack spacing={4}>
            {conversation.status === 'published' && (
              <IconButton
                variant="ghost"
                icon={<TbCopy />}
                aria-label="Copy url"
                onClick={handleCopy}
                color="gray.400"
                borderRadius="full"
              />
            )}
            <IconButton
              variant="ghost"
              icon={colorMode === 'light' ? <TbMoon /> : <TbSun />}
              aria-label="Toggle color mode"
              onClick={toggleColorMode}
              color="gray.400"
              borderRadius="full"
            />
          </HStack>
        </Flex>

        <Box minH="60vh">
          {reverse(conversation.content).map((item) => (
            <ChatMessagePreview
              key={item.id}
              message={item}
              userId={conversation.user_id}
              accentColor={accentColor}
            />
          ))}
          <Flex justify="center">
            <LightMode>
              <Button colorScheme={accentColor} onClick={handleContinueChat}>
                Continue this conversation
              </Button>
            </LightMode>
          </Flex>
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
                LessEffort
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Container>

      {showControl && (
        <Flex
          pos="fixed"
          bottom={{ base: 0, md: '2rem' }}
          left={0}
          right={0}
          margin="auto"
          w={{ base: 'full', md: 'calc(100vw - 2rem)' }}
          maxW={{ base: 'full', md: '25rem' }}
          bgColor="gray.900"
          p={4}
          pb={6}
          borderRadius={{ base: 'none', md: 'xl' }}
          justify="center"
          _light={{ bgColor: 'white' }}
        >
          <AccentColorRadio previewData={conversation} />
        </Flex>
      )}
    </>
  );
};
