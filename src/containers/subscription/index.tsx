import React, { useMemo } from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Flex,
  LightMode,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableCaption,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useBoolean,
  useDisclosure,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react';
import { captureException } from '@sentry/react';
import { cancelPlan, resumePlan } from 'api/plan';
import { MainLayout } from 'components/layout';
import MainNavbar from 'components/navbar/main';
import { TbDiamond } from 'react-icons/tb';
import { useUserData } from 'store/user';
import { accentColor } from 'theme/foundations/colors';
import { formatDate } from 'utils/common';

export const ManageSubscriptionContainer: React.FC = () => {
  const { user } = useUserData();
  const {
    isOpen: isOpenCancelSubsModal,
    onOpen: onOpenCancelSubsModal,
    onClose: onCloseCancelSubsModal,
  } = useDisclosure();
  const {
    isOpen: isOpenConfirmationModal,
    onOpen: onOpenConfirmationModal,
    onClose: onCloseConfirmationModal,
  } = useDisclosure({
    onClose: () => window.location.reload(),
  });
  const [isLessThanMd] = useMediaQuery('(max-width: 48em)');
  const [isLoading, { on, off }] = useBoolean();

  const data = useMemo(() => {
    if (!user) {
      return [];
    }

    return [
      {
        label: user?.cancelled ? 'Cancelling on' : 'Renewal date',
        value: user?.renews_at
          ? formatDate(new Date(user?.renews_at), true)
          : '-',
      },
      {
        label: 'Pricing',
        value: '$9.99 / month',
      },
    ];
  }, [user]);

  const handleAction = () => {
    let action = cancelPlan;
    if (user?.cancelled) {
      action = resumePlan;
    }

    on();
    action()
      .then(() => {
        onCloseCancelSubsModal();
        onOpenConfirmationModal();
      })
      .catch(captureException)
      .finally(off);
  };

  const cancellationSection = (
    <>
      <Box>
        If you have any questions, feel free to contact us at{' '}
        <LightMode>
          <Button
            colorScheme={accentColor()}
            variant="link"
            size="sm"
            as={Link}
            href="mailto: hi@lesseffort.io"
          >
            hi@lesseffort.io
          </Button>
        </LightMode>
        .
      </Box>
      {user?.cancelled ? (
        <Box pb={2}>
          To uncancel your subscription,{' '}
          <LightMode>
            <Button
              colorScheme={accentColor()}
              variant="link"
              size="sm"
              onClick={onOpenCancelSubsModal}
            >
              uncancel plan
            </Button>
          </LightMode>
          .
        </Box>
      ) : (
        <Box pb={2}>
          To cancel your subscription,{' '}
          <LightMode>
            <Button
              colorScheme={accentColor()}
              variant="link"
              size="sm"
              onClick={onOpenCancelSubsModal}
            >
              cancel plan
            </Button>
          </LightMode>
          .
        </Box>
      )}
    </>
  );

  const renderContent = () => {
    if (isLessThanMd) {
      return (
        <Box
          bgColor="gray.500"
          mt={4}
          p={4}
          borderRadius="xl"
          _light={{ bgColor: 'gray.100' }}
        >
          <VStack spacing={4} align="flex-start" mb={4}>
            {data.map((item) => (
              <Box key={item.label}>
                <Box color="gray.300" _light={{ color: 'gray.400' }}>
                  {item.label}
                </Box>
                <Box>{item.value}</Box>
              </Box>
            ))}
          </VStack>
          <hr />
          <Box mt={4} fontSize="sm">
            {cancellationSection}
          </Box>
        </Box>
      );
    }

    return (
      <Box
        bgColor="gray.500"
        mt={4}
        borderRadius="xl"
        _light={{ bgColor: 'gray.100' }}
        sx={{
          td: {
            _light: {
              borderColor: 'gray.200',
            },
          },
        }}
      >
        <TableContainer>
          <Table variant="simple">
            <TableCaption textAlign="left">{cancellationSection}</TableCaption>
            <Tbody>
              {data.map((item) => (
                <Tr key={item.label}>
                  <Td color="gray.300" _light={{ color: 'gray.400' }}>
                    {item.label}
                  </Td>
                  <Td>{item.value}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <>
      <MainLayout>
        <MainNavbar title="Manage Subscription" icon={TbDiamond} />

        <Flex
          mt={{ base: '5rem', md: '2rem' }}
          justify="space-between"
          align="center"
        >
          <Box fontSize="lg" fontWeight="bold">
            Your{' '}
            <Text color={accentColor('500')} as="span">
              {user?.plan} Plan
            </Text>
          </Box>
          <Box>
            <Tag
              colorScheme={user?.cancelled ? 'red' : 'green'}
              borderRadius="xl"
            >
              {user?.status_formatted}
            </Tag>
          </Box>
        </Flex>

        {renderContent()}
      </MainLayout>

      <Modal
        isOpen={isOpenCancelSubsModal}
        onClose={onCloseCancelSubsModal}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {user?.cancelled
              ? `We're happy to see you again!`
              : `We're sorry to see you go!`}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {user?.cancelled ? (
              <Box>
                If you proceed, your plan will be set to <b>not cancel</b> at
                the end of your current subscription period.
              </Box>
            ) : (
              <>
                <Box>
                  If you proceed, your plan will be set to <b>cancel</b> at the
                  end of your current subscription period.
                </Box>
                <Alert borderRadius="xl" mt={4} status="warning" fontSize="sm">
                  <AlertIcon alignSelf="baseline" />
                  <AlertDescription>
                    If you change your mind, you can uncancel any time before
                    the cancellation goes through.
                  </AlertDescription>
                </Alert>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              onClick={onCloseCancelSubsModal}
              mr={4}
              isDisabled={isLoading}
            >
              Back
            </Button>
            <LightMode>
              <Button
                colorScheme={user?.cancelled ? accentColor() : 'red'}
                onClick={handleAction}
                isLoading={isLoading}
              >
                {user?.cancelled
                  ? 'Confirm Uncancellation 🥳️️️'
                  : 'Confirm Cancellation 😞'}
              </Button>
            </LightMode>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isOpenConfirmationModal}
        onClose={onCloseConfirmationModal}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Success!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>Your change has been confirmed.</Box>

            <Alert borderRadius="xl" mt={4} status="success" fontSize="sm">
              <AlertIcon alignSelf="baseline" />
              <AlertDescription>Update confirmed</AlertDescription>
            </Alert>
          </ModalBody>

          <ModalFooter>
            <LightMode>
              <Button
                colorScheme={user?.cancelled ? accentColor() : 'red'}
                onClick={onCloseConfirmationModal}
                w="full"
              >
                Close
              </Button>
            </LightMode>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
