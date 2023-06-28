import { Box, Button, Link, Text, UseToastOptions } from '@chakra-ui/react';
import { standaloneToast } from 'index';
import ReactGA from 'react-ga4';

export const toastForFreeUser = (
  id: string,
  title: string = 'Upgrade your plan to access this feature!',
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
            variant="solid"
            bgColor="gray.800"
            color="gray.50"
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
      action: 'Copied',
      category: 'Action',
    });
    standaloneToast({
      id,
      position: 'bottom',
      duration: 1000,
      render: () => (
        <Box
          p={3}
          bgColor="gray.900"
          borderRadius="2xl"
          textAlign="center"
          w="12rem"
          _light={{
            color: 'white',
          }}
        >
          Copied to clipboard
        </Box>
      ),
      ...options,
    });
  }
};
