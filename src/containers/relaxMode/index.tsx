import React, { useLayoutEffect, useState } from 'react';
import { AspectRatio, Box, Flex } from '@chakra-ui/react';

export const RelaxModeContainer: React.FC = () => {
  const [date, setDate] = useState(new Date());

  function refreshClock() {
    setDate(new Date());
  }

  useLayoutEffect(() => {
    const timerId = setInterval(refreshClock, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);

  return (
    <Box pos="relative">
      <Flex pos="absolute" zIndex={1} top={4} left={4} gap={4}>
        <Flex
          align="center"
          gap={4}
          cursor="pointer"
          w="4rem"
          h="4rem"
          p={4}
          backdropFilter="blur(5px)"
          border="1px solid"
          borderColor="whiteAlpha.300"
          borderRadius="xl"
          flexShrink={0}
        >
          <img src="/favicon-32x32.png" alt="Logo Lesseffort" />
        </Flex>
        <Flex
          align="center"
          h="4rem"
          p={4}
          backdropFilter="blur(5px)"
          border="1px solid"
          borderColor="whiteAlpha.300"
          borderRadius="xl"
          fontSize="xl"
        >
          {date.toLocaleTimeString()}
        </Flex>
      </Flex>

      <Box
        as="iframe"
        pos="absolute"
        w="405px"
        h="calc(100vh - 2rem)"
        right={4}
        top={4}
        zIndex={1}
        borderRadius="xl"
        title="background"
        src="/"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
        allowFullScreen
        overflow="hidden"
      />

      <AspectRatio w="full" h="100vh" ratio={16 / 9} overflow="hidden">
        <Box
          as="iframe"
          transform="scale(120%)"
          title="background"
          src="https://www.youtube.com/embed/rQfZWKDn5Hg?autoplay=1&controls=0&mute=0&vq=hd1080&rel=0&disablekb=1"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
          allowFullScreen
        />
      </AspectRatio>
    </Box>
  );
};
