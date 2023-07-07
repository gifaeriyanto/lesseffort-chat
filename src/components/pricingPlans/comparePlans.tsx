import React from 'react';
import {
  Button,
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
import { accentColor } from 'theme/foundations/colors';

import { featuresData } from './data';

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
          {featuresData.map(([feature, free, premium]) => (
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
