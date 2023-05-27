import React, { PropsWithChildren } from 'react';
import {
  Box,
  HStack,
  useRadio,
  useRadioGroup,
  UseRadioProps,
  VStack,
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

export interface ColorModeRadioProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export const ColorModeRadio: React.FC<ColorModeRadioProps> = ({
  defaultValue,
  onChange,
}) => {
  const colorModeOptions = ['dark', 'light'];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'colorMode',
    defaultValue,
    onChange,
  });

  const group = getRootProps();

  return (
    <HStack spacing={4} align="flex-start" {...group}>
      {colorModeOptions.map((value) => {
        const radio = getRadioProps({ value });
        return (
          <RadioCard key={value} {...radio}>
            <Box
              w="6rem"
              bgColor={value === 'dark' ? CustomColor.background : 'gray.200'}
              borderRadius="xl"
              pos="relative"
              border="4px solid"
              borderColor={radio.isChecked ? 'blue.500' : 'transparent'}
            >
              <VStack spacing={2} p={4} align="flex-start">
                <Box bgColor="blue.500" w="50%" h="1rem" borderRadius="md" />
                <Box
                  bgColor={value === 'dark' ? 'gray.400' : 'gray.300'}
                  w="100%"
                  h="1rem"
                  borderRadius="md"
                />
                <Box bgColor="blue.500" w="60%" h="1rem" borderRadius="md" />
              </VStack>
            </Box>
            <Box
              hidden={!radio.isChecked}
              mt={2}
              color="gray.400"
              fontSize="sm"
            >
              {value}
            </Box>
          </RadioCard>
        );
      })}
    </HStack>
  );
};
