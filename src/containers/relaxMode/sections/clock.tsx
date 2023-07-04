import React, { useLayoutEffect, useState } from 'react';
import { Flex } from '@chakra-ui/layout';

export const ClockWidget: React.FC = () => {
  const [date, setDate] = useState(new Date());

  const refreshClock = () => {
    setDate(new Date());
  };

  useLayoutEffect(() => {
    const timerId = setInterval(refreshClock, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);

  return (
    <Flex
      align="center"
      h="3rem"
      p={4}
      backdropFilter="blur(5px)"
      border="1px solid"
      borderColor="whiteAlpha.300"
      borderRadius="xl"
      fontSize="xl"
      _light={{ color: 'gray.100' }}
    >
      {date.toLocaleTimeString()}
    </Flex>
  );
};
