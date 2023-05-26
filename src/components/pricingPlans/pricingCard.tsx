import { ReactElement } from 'react';
import {
  Box,
  Flex,
  Heading,
  Icon,
  LightMode,
  List,
  ListItem,
  Text,
} from '@chakra-ui/react';
import { TbCircleCheckFilled } from 'react-icons/tb';
import { CustomColor } from 'theme/foundations/colors';

import { Card, CardProps } from './card';

export interface PricingCardData {
  features: Array<string | string[]>;
  name: string;
  price: string;
  time?: string;
}

interface PricingCardProps extends CardProps {
  data: PricingCardData;
  button: ReactElement;
}

export const PricingCard = (props: PricingCardProps) => {
  const { data, button, ...rest } = props;
  const { features, price, name, time } = data;
  const accentColor = 'blue.500';

  return (
    <Card
      rounded="xl"
      bgColor="gray.600"
      border="1px solid"
      borderColor={CustomColor.border}
      _light={{ bgColor: 'gray.100', borderColor: 'transparent' }}
      {...rest}
    >
      <Heading size="md" fontWeight="extrabold">
        {name}
      </Heading>
      <Flex align="flex-end" fontWeight="extrabold" color={accentColor} my="8">
        <Heading size="3xl" fontWeight="inherit" lineHeight="0.9em">
          {price}
        </Heading>
        {time && (
          <Text fontWeight="normal" fontSize="2xl" ml={2} color="gray.400">
            / {time}
          </Text>
        )}
      </Flex>
      <List spacing="4" mb="8" maxW="28ch" mx="auto" h="18rem">
        {features.map((feature, index) => (
          <ListItem key={index} display="flex" alignItems="flex-start" gap={4}>
            <Icon
              mt="3px"
              fontSize="xl"
              as={TbCircleCheckFilled}
              color={accentColor}
            />
            {typeof feature === 'string' ? (
              <Text>{feature}</Text>
            ) : (
              <Box>
                <Text>{feature[0]}</Text>
                <Text fontSize="sm" color="gray.400">
                  {feature[1]}
                </Text>
              </Box>
            )}
          </ListItem>
        ))}
      </List>
      <LightMode>{button}</LightMode>
    </Card>
  );
};
