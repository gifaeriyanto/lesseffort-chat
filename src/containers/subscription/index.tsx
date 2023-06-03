import React from 'react';
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
  useDisclosure,
} from '@chakra-ui/react';
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
            <Tag colorScheme="green" borderRadius="xl">
              {user?.status_formatted}
            </Tag>
          </Box>
        </Flex>

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
              <TableCaption textAlign="left">
                <Box>
                  If you have any questions, feel free to contact us at{' '}
                  <Button
                    colorScheme={accentColor()}
                    variant="link"
                    size="sm"
                    as={Link}
                    href="mailto: hi@lesseffort.io"
                  >
                    hi@lesseffort.io
                  </Button>
                  .
                </Box>
                <Box pb={2}>
                  To cancel your subscription,{' '}
                  <Button
                    colorScheme={accentColor()}
                    variant="link"
                    size="sm"
                    onClick={onOpenCancelSubsModal}
                  >
                    cancel plan
                  </Button>
                  .
                </Box>
              </TableCaption>
              <Tbody>
                <Tr>
                  <Td color="gray.300" _light={{ color: 'gray.400' }}>
                    Renewal date
                  </Td>
                  <Td>
                    {user?.renews_at
                      ? formatDate(new Date(user?.renews_at), true)
                      : '-'}
                  </Td>
                </Tr>
                <Tr>
                  <Td color="gray.300" _light={{ color: 'gray.400' }}>
                    Price
                  </Td>
                  <Td>$9 / month</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </MainLayout>

      <Modal
        isOpen={isOpenCancelSubsModal}
        onClose={onCloseCancelSubsModal}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>We're sorry to see you go!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              If you proceed, your plan will be set to{' '}
              <Text as="b">cancel</Text> at the end of your current subscription
              period.
            </Box>
            <Alert borderRadius="xl" mt={4} status="warning" fontSize="sm">
              <AlertIcon alignSelf="baseline" />
              <AlertDescription>
                If you change your mind, you can uncancel any time before the
                cancellation goes through.
              </AlertDescription>
            </Alert>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onCloseCancelSubsModal} mr={4}>
              Back
            </Button>
            <LightMode>
              <Button colorScheme="red">Confirm Cancellation 😞</Button>
            </LightMode>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
