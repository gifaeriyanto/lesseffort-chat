import React, { useEffect, useState } from 'react';
import {
  Icon,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
} from '@chakra-ui/react';
import { TbSearch, TbX } from 'react-icons/tb';
import { debounce } from 'utils/common';

export interface SearchProps extends InputProps {
  onSearch: (keyword: string) => void;
}

export const Search: React.FC<SearchProps> = ({ onSearch, ...props }) => {
  const [search, setSearch] = useState('');

  useEffect(() => {
    onSearch(search);
  }, [search]);

  const debounceOnChange = debounce(
    (setter: Function, value: unknown) => setter(value),
    300,
  );

  return (
    <InputGroup>
      <Input
        placeholder="Search"
        onChange={(e) => debounceOnChange(setSearch, e.currentTarget.value)}
        {...props}
      />
      {!!search.length ? (
        <InputRightElement onClick={() => setSearch('')}>
          <Icon as={TbX} color="gray.400" />
        </InputRightElement>
      ) : (
        <InputRightElement>
          <Icon as={TbSearch} color="gray.400" />
        </InputRightElement>
      )}
    </InputGroup>
  );
};
