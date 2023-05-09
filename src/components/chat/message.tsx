import React, { PropsWithChildren } from 'react';
import {
  Avatar,
  Box,
  ButtonGroup,
  Flex,
  Icon,
  IconButton,
  IconButtonProps,
  Tooltip,
} from '@chakra-ui/react';
import {
  TbBookmark,
  TbBrandOpenai,
  TbCopy,
  TbPencil,
  TbReload,
} from 'react-icons/tb';
import ReactMarkdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeHighlight from 'rehype-highlight';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

export interface ChatMessageProps {
  isMe?: boolean;
  message: string;
  noActions?: boolean;
  onEdit?: () => void;
  onRegenerateResponse?: () => void;
}

export interface ChatMessageActionProps
  extends Omit<IconButtonProps, 'aria-label'> {
  title: string;
  icon: React.ReactElement;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const ChatMessageAction: React.FC<ChatMessageActionProps> = ({
  title,
  icon,
  onClick,
  ...props
}) => {
  return (
    <Tooltip label={title} openDelay={500}>
      <IconButton
        icon={icon}
        aria-label={title}
        variant="ghost"
        size="md"
        fontSize="2xl"
        color="gray.300"
        onClick={onClick}
        {...props}
      />
    </Tooltip>
  );
};

export const ChatMessage: React.FC<PropsWithChildren<ChatMessageProps>> = ({
  isMe,
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
    >
      {!noActions && (
        <ButtonGroup
          variant="outline"
          pos="absolute"
          top="0"
          right="0"
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
            />
          ) : (
            <ChatMessageAction
              title="Regenerate Response"
              icon={<TbReload />}
              onClick={onRegenerateResponse}
            />
          )}
          <ChatMessageAction
            title="Copy Text"
            icon={<TbCopy />}
            onClick={handleCopy}
          />
          <ChatMessageAction title="Save Message" icon={<TbBookmark />} />
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
        maxW="calc(100% - 4.375rem)"
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
          },
          ['pre code:not(.hljs)']: {
            maxWidth: 'full',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
          },
        }}
      >
        <ReactMarkdown
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
