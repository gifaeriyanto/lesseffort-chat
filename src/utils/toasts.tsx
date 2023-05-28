import { Button, Link, Text } from '@chakra-ui/react';
import { standaloneToast } from 'index';
import ReactGA from 'react-ga4';

export const toastForFreeUser = (
  id: string,
  title: string,
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
