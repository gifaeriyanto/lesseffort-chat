import React from 'react';
import {
  Button,
  Icon,
  LightMode,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { TbCheck, TbX } from 'react-icons/tb';
import { CustomColor } from 'theme/foundations/colors';

const features: [string, string | JSX.Element, string | JSX.Element][] = [
  ['Chat history', '5', 'Unlimited'],
  [
    'Search history',
    <Icon
      key="search_history_free"
      as={TbCheck}
      color="blue.500"
      fontSize="xl"
    />,
    <Icon
      key="search_history_premium"
      as={TbCheck}
      color="blue.500"
      fontSize="xl"
    />,
  ],
  [
    'Chat rules',
    <Icon key="chat_rules_free" as={TbCheck} color="blue.500" fontSize="xl" />,
    <Icon
      key="chat_rules_premium"
      as={TbCheck}
      color="blue.500"
      fontSize="xl"
    />,
  ],
  ['Starter prompts', '6 uses per-day', 'Unlimited'],
  [
    'Save prompts',
    <Icon key="save_prompts_free" as={TbX} color="gray.400" fontSize="xl" />,
    <Icon
      key="save_prompts_premium"
      as={TbCheck}
      color="blue.500"
      fontSize="xl"
    />,
  ],
  [
    'Create your own prompts',
    <Icon key="create_prompts_free" as={TbX} color="gray.400" fontSize="xl" />,
    <Icon
      key="create_prompts_premium"
      as={TbCheck}
      color="blue.500"
      fontSize="xl"
    />,
  ],
  ['Color mode', 'Light mode only', 'Light and Dark mode'],
  [
    'Save conversations',
    <Icon
      key="save_conversations_free"
      as={TbX}
      color="gray.400"
      fontSize="xl"
    />,
    <Icon
      key="save_conversations_premium"
      as={TbCheck}
      color="blue.500"
      fontSize="xl"
    />,
  ],
  [
    'Save messages',
    <Icon key="save_messages_free" as={TbX} color="gray.400" fontSize="xl" />,
    <Icon
      key="save_messages_premium"
      as={TbCheck}
      color="blue.500"
      fontSize="xl"
    />,
  ],
  [
    'Share conversations and message',
    <Icon
      key="share_conversations_free"
      as={TbX}
      color="gray.400"
      fontSize="xl"
    />,
    <Icon
      key="share_conversations_premium"
      as={TbCheck}
      color="blue.500"
      fontSize="xl"
    />,
  ],
  [
    'Export data',
    <Icon key="export_free" as={TbX} color="gray.400" fontSize="xl" />,
    <Icon key="export_premium" as={TbCheck} color="blue.500" fontSize="xl" />,
  ],
];

export const ComparePlans: React.FC = () => {
  return (
    <TableContainer
      sx={{
        'td, th': {
          borderColor: CustomColor.border,
          _light: {
            borderColor: CustomColor.lightBorder,
          },
        },
      }}
    >
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th></Th>
            <Th>Free</Th>
            <Th>Premium</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td color="gray.400">Price</Td>
            <Td fontSize="2xl" fontWeight="bold">
              $0
            </Td>
            <Td fontSize="2xl" fontWeight="bold">
              $9
            </Td>
          </Tr>
          {features.map(([feature, free, premium]) => (
            <Tr key={feature}>
              <Td color="gray.400">{feature}</Td>
              <Td fontWeight="bold">{free}</Td>
              <Td fontWeight="bold">{premium}</Td>
            </Tr>
          ))}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th></Th>
            <Th>
              <LightMode>
                <Button
                  colorScheme="blue"
                  variant="outline"
                  borderWidth="2px"
                  borderRadius="xl"
                  _hover={{
                    bgColor: 'transparent',
                    color: 'blue.400',
                  }}
                >
                  Start
                </Button>
              </LightMode>
            </Th>
            <Th>
              <LightMode>
                <Button colorScheme="blue" borderRadius="xl">
                  Buy now
                </Button>
              </LightMode>
            </Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};
