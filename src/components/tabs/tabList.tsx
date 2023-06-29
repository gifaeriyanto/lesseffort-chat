import React from 'react';
import { LightMode, Tab, TabList, useColorMode } from '@chakra-ui/react';
import { accentColor, CustomColor } from 'theme/foundations/colors';
import { capitalizeWords } from 'utils/common';

export interface CustomTabListProps {
  list: string[];
  onChange?: (value: string, index: number) => void;
}

export const CustomTabList: React.FC<CustomTabListProps> = ({
  list,
  onChange,
}) => {
  const { colorMode } = useColorMode();

  return (
    <LightMode>
      <TabList
        borderColor={
          colorMode === 'light' ? CustomColor.lightBorder : 'inherit'
        }
        _active={{
          button: {
            bgColor: 'transparent',
          },
        }}
        sx={{
          button: {
            color: 'gray.400',
            _selected: {
              fontWeight: 'bold',
              color: colorMode === 'light' ? 'gray.500' : 'gray.200',
              borderColor: accentColor('500'),
            },
          },
        }}
      >
        {list.map((item, index) => (
          <Tab
            key={item}
            fontSize="sm"
            onClick={() => {
              onChange?.(item, index);
            }}
          >
            {capitalizeWords(item)}
          </Tab>
        ))}
      </TabList>
    </LightMode>
  );
};
