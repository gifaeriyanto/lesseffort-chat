import React, {
  memo,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Avatar,
  Box,
  ButtonGroup,
  Flex,
  Icon,
  IconButton,
  IconButtonProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import {
  TbBookmark,
  TbBrandOpenai,
  TbCopy,
  TbDotsVertical,
  TbPencil,
  TbReload,
  TbTrash,
} from 'react-icons/tb';
import ReactMarkdown from 'react-markdown';
import { CodeProps } from 'react-markdown/lib/ast-to-react';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeHighlight from 'rehype-highlight';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { comingSoon } from 'utils/common';

export interface ChatMessageProps {
  isLockedChat?: boolean;
  isMe?: boolean;
  id?: number;
  message: string;
  noActions?: boolean;
  onEdit?: () => void;
  onRegenerateResponse?: () => void;
}

export interface ChatMessageActionProps
  extends Omit<IconButtonProps, 'aria-label'> {
  title: string;
  icon: React.ReactElement;
  isLockedChat?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const ChatMessageAction = React.forwardRef<
  HTMLButtonElement,
  ChatMessageActionProps
>(({ title, icon, isLockedChat, onClick, ...props }, ref) => {
  if (isLockedChat) {
    return null;
  }

  return (
    <Tooltip label={title} openDelay={500}>
      <IconButton
        ref={ref}
        icon={icon}
        aria-label={title}
        variant="ghost"
        size="sm"
        fontSize="md"
        color="gray.300"
        onClick={onClick}
        {...props}
      />
    </Tooltip>
  );
});

const CodeBlock = memo(({ node, inline, ...props }: CodeProps) => {
  const textInput = useRef<HTMLElement>(null);
  const [lang, setLang] = useState('');

  useEffect(() => {
    let className = props.className;
    setLang(className?.replace('hljs language-', '') || '');
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(textInput?.current?.textContent || '');
  };

  if (inline) {
    return <code {...props} />;
  }

  return (
    <Box pos="relative" p={lang ? 0 : 2}>
      {!!lang && (
        <Box fontSize="sm" color="gray.400" pl={2} pt={2} mb={4}>
          {lang}
        </Box>
      )}
      <Box as="code" ref={textInput} {...props} />
      <IconButton
        icon={<TbCopy />}
        aria-label="Copy code"
        onClick={handleCopy}
        pos="absolute"
        top={0}
        right={0}
        size="sm"
        fontSize="md"
      />
    </Box>
  );
});

export const ChatMessage: React.FC<PropsWithChildren<ChatMessageProps>> = ({
  isLockedChat,
  isMe,
  id,
  message,
  noActions,
  onEdit,
  onRegenerateResponse,
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(message);
  };

  return (
    <Flex
      py={2}
      pr={2}
      w="full"
      align="flex-start"
      gap={4}
      pos="relative"
      _hover={{
        ['.message-actions']: {
          opacity: 1,
        },
      }}
      id={`message-${id || 0}`}
    >
      {!noActions && (
        <ButtonGroup
          variant="outline"
          pos="absolute"
          top="0"
          right="1rem"
          bgColor="gray.700"
          className="message-actions"
          opacity="0"
          transition="0.2s ease opacity"
        >
          {isMe ? (
            <ChatMessageAction
              title="Edit Message"
              icon={<TbPencil />}
              onClick={onEdit}
              isLockedChat={isLockedChat}
            />
          ) : (
            <ChatMessageAction
              title="Regenerate Response"
              icon={<TbReload />}
              onClick={onRegenerateResponse}
              isLockedChat={isLockedChat}
            />
          )}
          <ChatMessageAction
            title="Copy Text"
            icon={<TbCopy />}
            onClick={handleCopy}
            isLockedChat={isLockedChat}
          />
          {/* Coming soon feature */}
          {false && (
            <Menu>
              <MenuButton
                as={ChatMessageAction}
                icon={<TbDotsVertical />}
                title="More actions"
              />
              <Portal>
                <MenuList>
                  <MenuItem onClick={comingSoon}>
                    <TbBookmark />
                    <Text ml={2}>Save message</Text>
                  </MenuItem>
                  <MenuItem onClick={comingSoon}>
                    <TbTrash />
                    <Text ml={2}>Delete message</Text>
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          )}
        </ButtonGroup>
      )}
      {isMe ? (
        <Avatar
          name="Demo"
          src="https://bit.ly/ryan-florence"
          w="2.188rem"
          h="2.188rem"
        />
      ) : (
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
      )}
      <Box
        mt="0.286rem"
        color={isMe ? 'gray.300' : 'gray.200'}
        maxW={{ base: 'calc(100vw - 6rem)', md: 'calc(100% - 4.375rem)' }}
        w="full"
        sx={{
          ['ul, ol']: {
            paddingLeft: '1.25rem',
          },
          ['p, li, pre']: {
            marginBottom: '1rem',
          },
          ['pre']: {
            maxWidth: 'full',
            borderRadius: 'md',
            bgColor: '#000 !important',
            p: 2,
          },
          table: {
            marginBottom: '1rem',
            w: 'full',
          },
          ['td, th']: {
            p: 2,
            border: '1px solid',
            borderColor: 'gray.400',
          },
          a: {
            color: 'blue.300',
            textDecor: 'underline',
          },
          ['.hljs']: {
            maxWidth: 'full',
            overflow: 'auto',
            fontSize: '0.938rem',
          },
          ['pre code:not(.hljs)']: {
            maxWidth: 'full',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
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
            borderColor: 'gray.400',
            pl: 4,
          },
        }}
      >
        <ReactMarkdown
          components={{
            code: CodeBlock,
          }}
          remarkPlugins={[remarkGfm, remarkBreaks]}
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
          {message}
        </ReactMarkdown>
      </Box>
    </Flex>
  );
};
