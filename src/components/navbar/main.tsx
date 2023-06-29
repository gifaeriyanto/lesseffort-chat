import React from 'react';
import {
  Box,
  Flex,
  Icon,
  IconButton,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import { TbMenu2 } from 'react-icons/tb';
import { useSidebar } from 'store/sidebar';
import { accentColor, CustomColor } from 'theme/foundations/colors';
import { shallow } from 'zustand/shallow';

export interface MainNavbar {
  title: string;
  description?: string;
  icon: any;
}

const MainNavbar: React.FC<MainNavbar> = ({ title, description, icon }) => {
  const [isLessThanMd] = useMediaQuery('(max-width: 48em)');
  const onOpen = useSidebar((state) => state.onOpen, shallow);

  const renderIcon = () => {
    return (
      <>
        {!isLessThanMd && (
          <Flex
            p={4}
            bgColor={accentColor('500')}
            w="2.188rem"
            h="2.188rem"
            align="center"
            justify="center"
            borderRadius="full"
            color="white"
          >
            <Icon as={icon} fontSize="2xl" />
          </Flex>
        )}
      </>
    );
  };

  return (
    <Flex
      justify="space-between"
      align="center"
      borderBottom="1px solid"
      borderColor={CustomColor.border}
      p={{ base: 4, md: 0 }}
      pb={{ base: 3, md: 2 }}
      w={{ base: 'full', md: 'auto' }}
      pos={{ base: 'fixed', md: 'initial' }}
      zIndex={1}
      top={0}
      left={0}
      bgColor="gray.700"
      _light={{
        borderColor: CustomColor.lightBorder,
        bgColor: { base: 'gray.100', md: 'gray.200' },
      }}
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
      <Flex
        align="center"
        justify={{ base: 'center', md: 'initial' }}
        gap={4}
        minW="0"
        py={description ? 'initial' : '0.4rem'}
      >
        {renderIcon()}
        <Box
          w={{ base: '60vw', md: 'full' }}
          maxW={{ base: 'full', md: 'calc(100% - 3.188rem)' }}
        >
          <Text
            fontWeight="bold"
            fontSize="xl"
            lineHeight="1.2"
            isTruncated
            textAlign={{ base: 'center', md: 'initial' }}
          >
            {title}
          </Text>
          {description && (
            <Text
              fontSize="sm"
              color="gray.400"
              textAlign={{ base: 'center', md: 'initial' }}
            >
              {description}
            </Text>
          )}
        </Box>
      </Flex>
      {/* to keep chat title centered */}
      <Box w="2.188rem" />
    </Flex>
  );
};

export default MainNavbar;
