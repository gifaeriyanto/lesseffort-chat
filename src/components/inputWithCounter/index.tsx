import React, { useState } from 'react';
import { Box, Input, InputProps } from '@chakra-ui/react';

export const InputWithCounter = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const [value, setValue] = useState(props.value || props.defaultValue || '');

    return (
      <Box pos="relative">
        <Input
          ref={ref}
          {...props}
          onChange={(e) => {
            setValue(e.currentTarget.value);
            props.onChange?.(e);
          }}
        />
        {typeof value === 'string' && props.max && (
          <Box
            fontSize="xs"
            color="gray.400"
            pos="absolute"
            top="-1.6rem"
            right={0}
          >
            {value.length} / {props.max}
          </Box>
        )}
      </Box>
    );
  },
);
