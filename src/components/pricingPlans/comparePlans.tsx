import React from 'react';
import {
  Button,
  Icon,
  LightMode,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { Plan } from 'components/pricingPlans';
import { ResponsiveTable } from 'components/table';
import { TbCheck, TbX } from 'react-icons/tb';
import { accentColor } from 'theme/foundations/colors';

const features: [string, string | JSX.Element, string | JSX.Element][] = [
  ['Chat history', '5', 'Unlimited'],
  [
    'Search history',
    <Icon key="search_history_free" as={TbX} color="gray.400" fontSize="xl" />,
    <Icon
      key="search_history_premium"
      as={TbCheck}
      color={accentColor('500')}
      fontSize="xl"
    />,
  ],
  [
    'Chat rules',
    <Icon
      key="chat_rules_free"
      as={TbCheck}
      color={accentColor('500')}
      fontSize="xl"
    />,
    <Icon
      key="chat_rules_premium"
      as={TbCheck}
      color={accentColor('500')}
      fontSize="xl"
    />,
  ],
  [
    'Save prompts',
    <Icon key="save_prompts_free" as={TbX} color="gray.400" fontSize="xl" />,
    <Icon
      key="save_prompts_premium"
      as={TbCheck}
      color={accentColor('500')}
      fontSize="xl"
    />,
  ],
  [
    'Create your own prompts',
    <Icon key="create_prompts_free" as={TbX} color="gray.400" fontSize="xl" />,
    <Icon
      key="create_prompts_premium"
      as={TbCheck}
      color={accentColor('500')}
      fontSize="xl"
    />,
  ],
  [
    'Dark mode',
    <Icon
      key="create_prompts_premium"
      as={TbCheck}
      color={accentColor('500')}
      fontSize="xl"
    />,
    <Icon
      key="create_prompts_premium"
      as={TbCheck}
      color={accentColor('500')}
      fontSize="xl"
    />,
  ],
  ['Accent color', 'Blue only', '9 color options'],
  [
    'Save messages',
    <Icon key="save_messages_free" as={TbX} color="gray.400" fontSize="xl" />,
    <Icon
      key="save_messages_premium"
      as={TbCheck}
      color={accentColor('500')}
      fontSize="xl"
    />,
  ],
  [
    'Share conversations',
    <Icon
      key="share_conversations_free"
      as={TbX}
      color="gray.400"
      fontSize="xl"
    />,
    <Icon
      key="share_conversations_premium"
      as={TbCheck}
      color={accentColor('500')}
      fontSize="xl"
    />,
  ],
  [
    'Export & import data',
    <Icon key="export_free" as={TbX} color="gray.400" fontSize="xl" />,
    <Icon
      key="export_premium"
      as={TbCheck}
      color={accentColor('500')}
      fontSize="xl"
    />,
  ],
];

export interface ComparePlansProps {
  onSelect?: (plan: Plan) => void;
}

export const ComparePlans: React.FC<ComparePlansProps> = ({ onSelect }) => {
  return (
    <ResponsiveTable>
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
              $9.99
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
            <Th>To convert</Th>
            <Th>
              <LightMode>
                <Button
                  colorScheme={accentColor()}
                  variant="outline"
                  borderRadius="xl"
                  onClick={() => onSelect?.(Plan.free)}
                >
                  Continue free
                </Button>
              </LightMode>
            </Th>
            <Th>
              <LightMode>
                <Button
                  colorScheme={accentColor()}
                  borderRadius="xl"
                  onClick={() => onSelect?.(Plan.premium)}
                >
                  Buy now
                </Button>
              </LightMode>
            </Th>
          </Tr>
        </Tfoot>
      </Table>
    </ResponsiveTable>
  );
};
