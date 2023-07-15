import React, { useLayoutEffect, useState } from 'react';
import { Flex } from '@chakra-ui/layout';
import { blurBackgroundProps } from 'utils/blurBackground';

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
      border="1px solid"
      borderRadius="xl"
      fontSize="xl"
      {...blurBackgroundProps}
    >
      {date.toLocaleTimeString()}
    </Flex>
  );
};
