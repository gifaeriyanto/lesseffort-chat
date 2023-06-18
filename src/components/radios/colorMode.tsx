import React, { PropsWithChildren } from 'react';
import {
  Box,
  HStack,
  useColorMode,
  useRadio,
  useRadioGroup,
  UseRadioProps,
  VStack,
} from '@chakra-ui/react';
import { useUserData } from 'store/user';
import { accentColor, CustomColor } from 'theme/foundations/colors';
import { shallow } from 'zustand/shallow';

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

export const ColorModeRadio: React.FC = () => {
  const isFreeUser = useUserData((state) => state.isFreeUser, shallow);
  const { toggleColorMode } = useColorMode();
  const colorModeOptions = ['dark', 'light'];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'colorMode',
    defaultValue: localStorage.getItem('chakra-ui-color-mode') || 'light',
    onChange: toggleColorMode,
  });

  const group = getRootProps();

  return (
    <HStack spacing={4} align="flex-start" {...group}>
      {colorModeOptions.map((value) => {
        const radio = getRadioProps({ value, isDisabled: isFreeUser });
        return (
          <RadioCard key={value} {...radio}>
            <Box
              w="6rem"
              bgColor={value === 'dark' ? CustomColor.background : 'gray.200'}
              borderRadius="xl"
              pos="relative"
              border="4px solid"
              borderColor={radio.isChecked ? accentColor('500') : 'transparent'}
            >
              <VStack spacing={2} p={4} align="flex-start">
                <Box
                  bgColor={accentColor('500')}
                  w="50%"
                  h="1rem"
                  borderRadius="md"
                />
                <Box
                  bgColor={value === 'dark' ? 'whiteAlpha.300' : 'gray.300'}
                  w="100%"
                  h="1rem"
                  borderRadius="md"
                />
                <Box
                  bgColor={accentColor('500')}
                  w="60%"
                  h="1rem"
                  borderRadius="md"
                />
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
