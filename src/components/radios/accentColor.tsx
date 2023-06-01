import React, { PropsWithChildren } from 'react';
import {
  Box,
  HStack,
  useRadio,
  useRadioGroup,
  UseRadioProps,
} from '@chakra-ui/react';
import { supabase } from 'store/supabase';
import { SharedConversation } from 'store/supabase/chat';
import { useUserData } from 'store/user';
import { accentColor } from 'theme/foundations/colors';
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

export interface AccentColorRadioProps {
  previewData?: SharedConversation;
}

export const AccentColorRadio: React.FC<AccentColorRadioProps> = ({
  previewData,
}) => {
  const isFreeUser = useUserData((state) => state.isFreeUser, shallow);

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
    defaultValue: previewData ? previewData?.color_scheme : accentColor(),
    onChange: async (value) => {
      if (previewData) {
        await supabase
          .from('shared_conversations')
          .update({
            color_scheme: value,
          })
          .eq('uid', previewData?.uid);
        window.location.reload();
      } else {
        localStorage.setItem('accentColor', value);
        window.location.reload();
      }
    },
  });

  const group = getRootProps();

  return (
    <HStack align="flex-start" {...group}>
      {accentColorOptions.map((value) => {
        const radio = getRadioProps({ value });
        return (
          <RadioCard key={value} {...radio} isDisabled={isFreeUser}>
            <Box w="2rem" h="2rem" bgColor={`${value}.500`} borderRadius="xl" />
            <Box
              hidden={!radio.isChecked}
              color="gray.400"
              fontSize="sm"
              mt={2}
              pos="absolute"
            >
              {value}
            </Box>
            <Box h="1.375rem" />
          </RadioCard>
        );
      })}
    </HStack>
  );
};
