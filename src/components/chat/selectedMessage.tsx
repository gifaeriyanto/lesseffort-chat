import React from 'react';
import { Box, Flex, Icon, IconButton } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { TbX } from 'react-icons/tb';

export interface SelectedMessageProps {
  title: string;
  icon: IconType;
  info?: React.ReactNode;
  onClose: () => void;
}

const SelectedMessage: React.FC<SelectedMessageProps> = ({
  title,
  icon,
  info,
  onClose,
}) => {
  return (
    <Flex
      align="center"
      py={2}
      maxW={{ base: 'calc(100vw - 2rem)', md: 'auto' }}
    >
      <Box w="4rem" textAlign="center" flexGrow="0" flexShrink="0">
        <Icon as={icon} fontSize="2xl" color="blue.500" />
      </Box>
      <Box
        w="full"
        maxW="calc(100% - 8.25rem)"
        pl={4}
        borderLeft="1px solid"
        borderColor="blue.500"
        flexGrow="0"
        flexShrink="0"
      >
        {!!info && (
          <Flex align="center" color="blue.500">
            {info}
          </Flex>
        )}
        <Box isTruncated maxW="100%">
          {title}
        </Box>
      </Box>
      <IconButton
        icon={<TbX />}
        aria-label="Cancel edit"
        variant="ghost"
        mx={4}
        fontSize="xl"
        onClick={onClose}
      />
    </Flex>
  );
};

export default SelectedMessage;
