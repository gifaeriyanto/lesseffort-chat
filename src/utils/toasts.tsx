import { Box, Button, Link, Text, UseToastOptions } from '@chakra-ui/react';
import { standaloneToast } from 'index';
import ReactGA from 'react-ga4';

export const toastForFreeUser = (
  id: string,
  title: string = 'Upgrade your plan to access saved messages!',
  description?: string,
) => {
  if (!standaloneToast.isActive(id)) {
    ReactGA.event({
      action: `Limit ${id}`,
      category: 'Action',
    });
    standaloneToast({
      id,
      title,
      description: (
        <>
          {!!description && <Text color="whiteAlpha.700">{description}</Text>}
          <Button
            as={Link}
            size="sm"
            mt={2}
            colorScheme="blackAlpha"
            href="/plans"
            _hover={{
              textDecor: 'none',
            }}
          >
            Upgrade now
          </Button>
        </>
      ),
      status: 'warning',
    });
  }
};

export const toastForCopy = (id: string, options: UseToastOptions = {}) => {
  if (!standaloneToast.isActive(id)) {
    ReactGA.event({
      action: `Limit ${id}`,
      category: 'Action',
    });
    standaloneToast({
      id,
      position: 'bottom',
      duration: 1000,
      render: () => (
        <Box
          color="white"
          p={3}
          bg="gray.900"
          borderRadius="2xl"
          textAlign="center"
        >
          Copied to clipboard
        </Box>
      ),
      ...options,
    });
  }
};
