import React, { PropsWithChildren } from 'react';
import {
  Box,
  HStack,
  useRadio,
  useRadioGroup,
  UseRadioProps,
} from '@chakra-ui/react';
import { group } from 'console';
import { CustomColor } from 'theme/foundations/colors';

const RadioCard: React.FC<UseRadioProps & PropsWithChildren> = (props) => {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box {...checkbox} cursor="pointer">
        {props.children}
      </Box>
    </Box>
  );
};

export interface AccentColorRadioProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export const AccentColorRadio: React.FC<AccentColorRadioProps> = ({
  defaultValue,
  onChange,
}) => {
  const accentColorOptions = [
    'blue',
    'red',
    'orange',
    'yellow',
    'green',
    'teal',
    'cyan',
    'purple',
    'pink',
  ];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'accentColor',
    defaultValue,
    onChange,
  });

  const group = getRootProps();

  return (
    <HStack align="flex-start" {...group}>
      {accentColorOptions.map((value) => {
        const radio = getRadioProps({ value });
        return (
          <RadioCard key={value} {...radio}>
            <Box
              w="2rem"
              h="2rem"
              bgColor={`${value}.500`}
              borderRadius="xl"
              pos="relative"
            >
              <Box
                hidden={!radio.isChecked}
                pos="absolute"
                top="2.2rem"
                color="gray.400"
                fontSize="sm"
              >
                {value}
              </Box>
            </Box>
          </RadioCard>
        );
      })}
    </HStack>
  );
};
