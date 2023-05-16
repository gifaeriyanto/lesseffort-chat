import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Icon,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Select,
  Skeleton,
  Text,
  useBoolean,
  VStack,
} from '@chakra-ui/react';
import { ChatMessageAction } from 'components/chat/message';
import { Search } from 'components/search';
import { TbFilter, TbThumbUp } from 'react-icons/tb';
import {
  defaultOrder,
  getPage,
  getPrompts,
  getPromptsCount,
  Prompt,
} from 'store/supabase';
import { CustomColor } from 'theme/foundations/colors';
import {
  createIncrementArray,
  formatLocaleNumber,
  formatNumber,
} from 'utils/common';

export interface StarterContainerProps {
  onSelectPrompt: (prompt: Prompt) => void;
}

const COMMUNITIES: Record<string, string> = {
  'Copywriting-00ea56f446414284': 'Copywriting',
  'DevOps-f3e52afbf831197f': 'DevOps',
  'Generative-AI-b983edfcaa490850': 'Generative AI',
  'Marketing-cc647f5cf02ffd02': 'Marketing',
  'OperatingSystems-8a5ca60d957fe707': 'Operating Systems',
  'Productivity-b5a49cdd0796137a': 'Productivity',
  'SaaS-84c5d6a7b8e9f0c2': 'SaaS',
  'SEO-84c5d6a7b8e9f0c1': 'SEO',
  'Applications-f69b52b4213a6bd3': 'Software Applications',
  'SoftwareEngineering-f1858b980c341d28': 'Software Engineering',
  'Unsure-f69c57b424376b23': 'UNSURE',
};

export const StarterContainer: React.FC<StarterContainerProps> = ({
  onSelectPrompt,
}) => {
  const [keyword, setKeyword] = useState('');
  const [order, setOrder] = useState(defaultOrder);
  const [community, setCommunity] = useState('');
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(0);
  const [isLoading, { on: onLoading, off: offLoading }] = useBoolean();

  const pageFromTo = useMemo(() => {
    const { from, to } = getPage(page, pageSize);
    return {
      from: from + 1,
      to: count < pageSize ? count : to + 1,
    };
  }, [page]);

  useEffect(() => {
    setPage(1);
  }, [count, order]);

  useEffect(() => {
    onLoading();
    Promise.all([
      getPrompts({ page, pageSize, keyword, order, community }),
      getPromptsCount({ keyword, order, community }),
    ])
      .then((res) => {
        setPrompts(res[0].data as Prompt[]);
        setCount(res[1].count || 0);
      })
      .finally(offLoading);
  }, [page, pageSize, keyword, order, community]);

  return (
    <Box p={4} pt={0} w="full">
      <Flex
        justify="space-between"
        align={{ base: 'flex-start', md: 'center' }}
        direction={{ base: 'column', md: 'row' }}
        gap={4}
      >
        <Box>
          <Box fontSize="xl" fontWeight="bold">
            <Text color="blue.500" as="span">
              Starter
            </Text>{' '}
            Prompts
          </Box>
          <Box fontSize="sm" color="gray.400">
            {!!count ? (
              <>
                <Box as="b" color="gray.300">
                  {formatLocaleNumber(count)}
                </Box>{' '}
                {keyword ? 'prompts match your filter' : 'available prompts'}
              </>
            ) : (
              'No prompts match with your filter'
            )}
          </Box>
        </Box>
        <Flex gap={4} w={{ base: 'full', md: 'auto' }}>
          <Popover>
            <PopoverTrigger>
              <ChatMessageAction
                icon={<TbFilter />}
                title="Filter"
                size="md"
                borderRadius="xl"
                variant="outline"
              />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverBody>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Sort by</FormLabel>
                    <Select onChange={(e) => setOrder(e.currentTarget.value)}>
                      <option value="Votes">Top votes</option>
                      <option value="Views">Top views</option>
                      <option value="CreationTime">Latest updates</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Topic</FormLabel>
                    <Select
                      onChange={(e) => setCommunity(e.currentTarget.value)}
                    >
                      <option value="">All</option>
                      {Object.entries(COMMUNITIES).map(([key, value]) => (
                        <option value={key} key={key}>
                          {value}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <Box w={{ base: 'full', md: 'auto' }}>
            <Search onSearch={setKeyword} borderRadius="xl" />
          </Box>
        </Flex>
      </Flex>

      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4} mt={4}>
        {isLoading ? (
          <>
            {createIncrementArray(4).map((item) => (
              <GridItem
                key={item}
                border="1px solid"
                borderColor={CustomColor.border}
                p={4}
                h="full"
                borderRadius="xl"
              >
                <VStack spacing={4} align="flex-start">
                  <Skeleton height="1.2rem" w="80%" />
                  <Skeleton height="0.8rem" w="40%" />
                </VStack>
                <VStack spacing={4} align="flex-start" mt={8}>
                  <Skeleton height="0.8rem" w="100%" />
                  <Skeleton height="0.8rem" w="100%" />
                  <Skeleton height="0.8rem" w="70%" />
                </VStack>
                <HStack mt={6}>
                  <Skeleton height="0.8rem" w="20%" />
                  <Skeleton height="0.8rem" w="20%" />
                </HStack>
              </GridItem>
            ))}
          </>
        ) : (
          <>
            {prompts
              .filter((item) => item.Title.match(new RegExp(keyword, 'i')))
              .map((item) => (
                <GridItem key={item.ID}>
                  <Flex
                    border="1px solid"
                    borderColor={CustomColor.border}
                    p={4}
                    h="full"
                    borderRadius="xl"
                    direction="column"
                    role="button"
                    _hover={{ bgColor: 'gray.600' }}
                    onClick={() => onSelectPrompt(item)}
                  >
                    <Box fontWeight="bold" fontSize="lg">
                      {item.Title}
                    </Box>
                    <Box fontSize="sm" color="gray.400" mb={4}>
                      <Link
                        href={item.AuthorURL}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.AuthorName}
                      </Link>{' '}
                      . {COMMUNITIES[item.Community]}
                    </Box>
                    <Box fontSize="sm" color="gray.300">
                      {item.Teaser}
                    </Box>

                    <HStack
                      fontSize="sm"
                      color="gray.300"
                      spacing={2}
                      mt="auto"
                      pt={4}
                    >
                      <Box>{formatNumber(item.Views)} views</Box>
                      <Box>.</Box>
                      <Flex align="center" gap={2}>
                        <Icon as={TbThumbUp} /> {formatNumber(item.Votes)}
                      </Flex>
                    </HStack>
                  </Flex>
                </GridItem>
              ))}
          </>
        )}
      </Grid>

      <Flex
        borderRadius="xl"
        border="1px solid"
        borderColor={CustomColor.border}
        mt={4}
        p={4}
        justify="space-between"
        fontSize="sm"
        align="center"
        hidden={count < pageSize && page === 1}
      >
        <Box pl={2} color="gray.400">
          Results: {pageFromTo.from} - {pageFromTo.to} of{' '}
          {formatLocaleNumber(count)}
        </Box>
        <ButtonGroup size="sm" variant="outline">
          <Button
            onClick={() => setPage((prev) => prev - 1)}
            isDisabled={page <= 1}
          >
            Prev
          </Button>
          <Button
            onClick={() => setPage((prev) => prev + 1)}
            isDisabled={count < pageSize}
          >
            Next
          </Button>
        </ButtonGroup>
      </Flex>
    </Box>
  );
};
