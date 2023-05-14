import React, { useState } from 'react';
import { Flex, Select } from '@chakra-ui/react';
import { Search } from 'components/search';

export const StarterContainer: React.FC = () => {
  const [search, setSearch] = useState('');

  return (
    <Flex gap={4}>
      <Select placeholder="Select option">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </Select>
      <Search onSearch={setSearch} />
    </Flex>
  );
};
