import React from 'react';
import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import { CustomColor } from 'theme/foundations/colors';

export const Profile: React.FC = () => {
  return (
    <Flex
      bgColor={CustomColor.card}
      borderRadius="2xl"
      p={4}
      border="1px solid"
      borderColor={CustomColor.border}
      align="center"
      gap={4}
    >
      <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
      <Box>
        <Text fontWeight="bold">Ryan Florence</Text>
        <Text fontSize="sm" color="gray.400">
          ryan@gmail.com
        </Text>
      </Box>
    </Flex>
  );
};
