import React, { useLayoutEffect, useRef, useState } from 'react';
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
  const inputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
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
        ref={inputRef}
        {...props}
      />
      {!!search.length ? (
        <InputRightElement
          onClick={() => {
            setSearch('');
            if (inputRef.current) {
              (inputRef.current as HTMLInputElement).value = '';
            }
          }}
        >
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
