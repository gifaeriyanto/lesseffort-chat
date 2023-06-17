import React, { PropsWithChildren, useMemo } from 'react';
import {
  Box,
  Button,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { Message } from 'api/chat';
import { ProfilePhotoPreview } from 'components/chat/preview/profilePhoto';
import { CodeBlock } from 'components/codeBlock';
import { ResponsiveTableMd } from 'components/table';
import { TbBrandOpenai } from 'react-icons/tb';
import ReactMarkdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeHighlight from 'rehype-highlight';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
// import remarkHTMLKatex from 'remark-html-katex';

// import 'katex/dist/katex.min.css';

export interface ChatMessagePreviewProps {
  message: Message;
  photo: string;
  accentColor: string;
}

export const ChatMessagePreview: React.FC<
  PropsWithChildren<ChatMessagePreviewProps>
> = ({ message, photo, accentColor = 'blue' }) => {
  const {
    isOpen: isOpenAllMessages,
    onOpen: onOpenAllMessages,
    onClose: onCloseAllMessages,
  } = useDisclosure();
  const { isMe, rulesCount, oldGeneratedMessages } = useMemo(() => {
    return {
      isMe: message.role === 'user',
      rulesCount: message.rules
        ? Object.values(message.rules).filter(Boolean).length
        : 0,
      oldGeneratedMessages: message.allContents || [],
    };
  }, [message]);

  return (
    <>
      <Flex
        py={2}
        w="full"
        align="flex-start"
        gap={4}
        pos="relative"
        _hover={{
          md: {
            ['.message-actions']: {
              opacity: 1,
            },
          },
        }}
        id={`message-${message.id || 0}`}
      >
        <Box>
          {isMe ? (
            <ProfilePhotoPreview mt="0.5rem" photo={photo} />
          ) : (
            <Flex
              p={4}
              bgColor="#74AA9C"
              w="2.188rem"
              h="2.188rem"
              align="center"
              justify="center"
              borderRadius="full"
              color="white"
              mt="0.5rem"
            >
              <Icon as={TbBrandOpenai} fontSize="2xl" />
            </Flex>
          )}
        </Box>

        <Box
          mt="0.286rem"
          color="gray.200"
          _light={{
            color: 'gray.600',
          }}
          maxW={{ base: 'calc(100vw - 6rem)', md: 'calc(100% - 4.375rem)' }}
          w="full"
          sx={{
            ['ul, ol']: {
              paddingLeft: '1.25rem',
            },
            ['p, li, pre, hr']: {
              marginBottom: '1rem',
            },
            ['pre']: {
              maxWidth: 'full',
              borderRadius: 'md',
              bgColor: '#000 !important',
              p: 4,
            },
            table: {
              w: 'full',
            },
            ['td, th']: {
              p: 2,
              border: '1px solid',
              borderColor: 'gray.400',
            },
            a: {
              color: isMe ? `${accentColor}.200` : `${accentColor}.300`,
              textDecor: 'underline',
              _light: {
                color: isMe ? `${accentColor}.200` : `${accentColor}.600`,
              },
            },
            ['.hljs']: {
              maxWidth: 'full',
              overflow: 'auto',
              fontSize: '0.938rem',
              p: 0,
            },
            ['pre code:not(.hljs)']: {
              maxWidth: 'full',
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              _light: {
                color: '#fff',
              },
            },
            ['table th']: {
              bgColor: 'gray.700',
              _light: {
                bgColor: 'gray.200',
              },
            },
            ['table td, table th']: {
              fontSize: '0.938rem',
              verticalAlign: 'baseline',
            },
            ['h1, h2, h3']: {
              fontWeight: 'bold',
              marginBottom: '1rem',
            },
            h1: {
              fontSize: '1.8rem',
            },
            h2: {
              fontSize: '1.4rem',
            },
            h3: {
              fontSize: '1.2rem',
            },
            blockquote: {
              borderLeft: '2px solid',
              borderColor: isMe ? `${accentColor}.200` : 'gray.400',
              pl: 4,
            },
            '.md-wrapper': {
              w: oldGeneratedMessages.length ? 'full' : 'auto',
              maxW: 'full',
              color: isMe
                ? ['cyan', 'yellow'].includes(accentColor)
                  ? 'gray.700'
                  : 'white'
                : 'inherit',
              bgColor: isMe ? `${accentColor}.500` : 'gray.500',
              display: 'inline-block',
              py: 2,
              px: 4,
              mb: oldGeneratedMessages.length ? 0 : '1rem',
              borderRadius: 'xl',
              borderBottomRadius: oldGeneratedMessages.length ? 0 : 'xl',
              '& > *:last-child': {
                mb: 0,
              },
              '& > pre': {
                borderRadius: 'lg',
                minW: '16rem',
              },
              '& > pre:first-of-type': {
                mt: 2,
              },
              '& > pre:last-child': {
                mb: 2,
              },
              _light: {
                bgColor: isMe ? `${accentColor}.500` : 'gray.100',
              },
              _after: rulesCount
                ? {
                    content: `"${rulesCount} ${
                      rulesCount > 1 ? 'rules' : 'rule'
                    } applied"`,
                    display: 'block',
                    color: `${accentColor}.300`,
                    fontSize: 'sm',
                  }
                : undefined,
            },
          }}
        >
          <ReactMarkdown
            components={{
              code: CodeBlock,
              table: ResponsiveTableMd,
            }}
            remarkPlugins={[remarkGfm, remarkBreaks]}
            // Math support conflicting with using usd symbol ($)
            // remarkPlugins={[remarkGfm, remarkBreaks, remarkMath, remarkHTMLKatex]}
            className="md-wrapper"
            rehypePlugins={[
              [
                rehypeHighlight,
                {
                  ignoreMissing: true,
                },
              ],
              [
                rehypeExternalLinks,
                {
                  target: '_blank',
                  rel: 'noopener noreferrer',
                },
              ],
            ]}
          >
            {message.content}
          </ReactMarkdown>
          {!!oldGeneratedMessages.length && (
            <Flex
              bgColor="gray.600"
              p="0.5rem 1rem"
              borderBottomRadius="xl"
              mb={4}
              justify="flex-end"
              _light={{ bgColor: 'gray.50' }}
            >
              <Button
                size="xs"
                variant="ghost"
                color="gray.400"
                _hover={{ color: 'gray.300' }}
                onClick={onOpenAllMessages}
              >
                See all messages
              </Button>
            </Flex>
          )}
        </Box>
      </Flex>

      <Modal isOpen={isOpenAllMessages} onClose={onCloseAllMessages} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>All Generated Messages</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <VStack>
              {message.allContents?.map((item, index) => (
                <Box
                  key={index}
                  bgColor="gray.500"
                  p={4}
                  borderRadius="xl"
                  _light={{ bgColor: 'gray.100' }}
                >
                  {item}
                </Box>
              ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
