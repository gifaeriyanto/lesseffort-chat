import React, { PropsWithChildren, useLayoutEffect } from 'react';
import { BoxProps, Flex, Grid, GridItem } from '@chakra-ui/react';
import { ChatSidebar } from 'components/chat/sidebar';
import { useChat } from 'store/chat';
import { useSidebar } from 'store/sidebar';
import { shallow } from 'zustand/shallow';

export const MainLayout: React.FC<BoxProps & PropsWithChildren> = ({
  children,
  ...props
}) => {
  const reset = useChat((state) => state.reset, shallow);
  const onCloseSidebar = useSidebar((state) => state.onClose, shallow);

  useLayoutEffect(() => {
    reset();
    onCloseSidebar();
  }, []);

  return (
    <Grid
      templateColumns={{ base: '1fr', md: '18.75rem 1fr' }}
      gap={{ base: 0, md: 4 }}
      p={{ base: 4, md: 4 }}
      {...props}
    >
      <GridItem>
        <ChatSidebar />
      </GridItem>
      <GridItem>
        <Flex
          w="full"
          maxW="60rem"
          direction="column"
          h={{ base: 'auto', md: 'calc(100vh - 2rem)' }}
          m="auto"
        >
          {children}
        </Flex>
      </GridItem>
    </Grid>
  );
};
