import React, { PropsWithChildren } from 'react';
import {
  Box,
  Flex,
  HStack,
  useRadio,
  useRadioGroup,
  UseRadioProps,
} from '@chakra-ui/react';
import { accentColor } from 'theme/foundations/colors';

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

export const FontSizeRadio: React.FC = () => {
  const fontSizeOptions = ['14px', '16px', '18px'];
  const fontSizeLabelOptions = ['Small', 'Normal', 'Large'];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'fontSize',
    defaultValue: localStorage.getItem('fontSize') || '16px',
    onChange: (value) => {
      localStorage.setItem('fontSize', value);
      window.location.reload();
    },
  });

  const group = getRootProps();

  return (
    <HStack align="flex-start" {...group}>
      {fontSizeOptions.map((value, index) => {
        const radio = getRadioProps({ value });
        return (
          <RadioCard key={value} {...radio}>
            <Flex
              w="3rem"
              h="3rem"
              fontSize={value}
              borderRadius="xl"
              border="2px solid"
              borderColor={radio.isChecked ? accentColor('500') : 'gray.500'}
              align="center"
              justify="center"
            >
              Aa
            </Flex>
            <Box
              hidden={!radio.isChecked}
              color="gray.400"
              fontSize="sm"
              mt={2}
            >
              {fontSizeLabelOptions[index]}
            </Box>
          </RadioCard>
        );
      })}
    </HStack>
  );
};
