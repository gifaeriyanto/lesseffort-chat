import React, { useLayoutEffect, useMemo, useState } from 'react';
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
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Select,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { captureException } from '@sentry/react';
import {
  defaultOrder,
  getPage,
  getPrompts,
  getPromptsCount,
  PromptData,
} from 'api/supabase/prompts';
import { ChatMessageAction } from 'components/chat/message';
import { Empty } from 'components/empty';
import { Search } from 'components/search';
import { CreatePrompt } from 'containers/chat/createPrompt';
import { TbFilter } from 'react-icons/tb';
import { useQuery } from 'react-query';
import { accentColor, CustomColor } from 'theme/foundations/colors';
import {
  createIncrementArray,
  formatLocaleNumber,
  formatNumber,
} from 'utils/common';

export enum PromptCategory {
  'copywriting' = 'Copywriting',
  'generativeAI' = 'Generative AI',
  'marketing' = 'Marketing',
  'productivity' = 'Productivity',
  'softwareEngineering' = 'Software Engineering',
  'other' = 'Other',
}

export interface StarterPromptsProps {
  onSelectPrompt: (prompt: PromptData) => void;
}

export const StarterPrompts: React.FC<StarterPromptsProps> = ({
  onSelectPrompt,
}) => {
  const [keyword, setKeyword] = useState('');
  const [order, setOrder] = useState(defaultOrder);
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchPrompts = () =>
    Promise.all([
      getPrompts({ page, pageSize, keyword, order, category }),
      getPromptsCount({ keyword, category }),
    ]);

  const { data, isLoading, error, refetch } = useQuery(
    `prompts-${page}-${pageSize}-${order}-${keyword}-${category}`,
    fetchPrompts,
  );

  useLayoutEffect(() => {
    setPage(1);
  }, [keyword, order, category]);

  const [prompts, count] = useMemo(() => {
    if (!data) {
      return [[], 0];
    }
    return data;
  }, [data]);

  const isLastPage = useMemo(() => {
    const lastPage = Math.ceil(count / pageSize);
    return page >= lastPage;
  }, [prompts, count]);

  const pageFromTo = useMemo(() => {
    const { from, to } = getPage(page, pageSize);
    return {
      from: from + 1,
      to: to + 1,
    };
  }, [page]);

  useLayoutEffect(() => {
    if (error) {
      captureException(error);
    }
  }, [error]);

  return (
    <>
      <Flex
        justify="space-between"
        align={{ base: 'flex-start', md: 'center' }}
        direction={{ base: 'column', md: 'row' }}
        gap={4}
      >
        <Box>
          <Flex fontSize="xl" fontWeight="bold" align="center" gap={1}>
            <Text color={accentColor('500')} as="span">
              Starter
            </Text>
            <Text>Prompts</Text>
          </Flex>
          <Box fontSize="sm" color="gray.400">
            {!!count ? (
              <>
                <Box as="b" color="gray.300" _light={{ color: 'gray.400' }}>
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
          <CreatePrompt onSuccess={refetch} />
          <Popover>
            <PopoverTrigger>
              <ChatMessageAction
                icon={<TbFilter />}
                title="Filter"
                size="md"
                borderRadius="xl"
                variant="outline"
                _light={{
                  borderColor: CustomColor.lightBorder,
                  bgColor: 'gray.100',
                  color: 'gray.500',
                }}
              />
            </PopoverTrigger>
            <PopoverContent borderRadius="xl">
              <PopoverArrow />
              <PopoverBody>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="sm">Sort by</FormLabel>
                    <Select onChange={(e) => setOrder(e.currentTarget.value)}>
                      <option value="usages">Top usage</option>
                      <option value="usages_last_week">
                        Top usage (weekly)
                      </option>
                      <option value="created_at">Latest updates</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Category</FormLabel>
                    <Select
                      onChange={(e) => setCategory(e.currentTarget.value)}
                    >
                      <option value="">All</option>
                      {Object.values(PromptCategory).map((value) => (
                        <option value={value} key={value}>
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

      <Empty
        hidden={
          isLoading ||
          !!prompts.filter((item) => item.title.match(new RegExp(keyword, 'i')))
            .length
        }
        message="No prompts match your filter"
        h={{ base: 'calc(100vh - 470px)', md: 'calc(100vh - 350px)' }}
      />

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
                _light={{
                  borderColor: CustomColor.lightBorder,
                }}
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
              .filter((item) => item.title.match(new RegExp(keyword, 'i')))
              .map((item) => (
                <GridItem key={item.id}>
                  <Flex
                    border="1px solid"
                    borderColor={CustomColor.border}
                    p={4}
                    h="full"
                    borderRadius="xl"
                    direction="column"
                    role="button"
                    _hover={{
                      bgColor: 'gray.600',
                      _light: {
                        bgColor: 'gray.100',
                      },
                    }}
                    onClick={() => onSelectPrompt(item)}
                    _light={{
                      bgColor: 'gray.100',
                      borderColor: CustomColor.lightBorder,
                    }}
                  >
                    <Box fontWeight="bold" fontSize="lg">
                      {item.title}
                    </Box>
                    <Box fontSize="sm" color="gray.400" mb={4}>
                      {item.category} . by {item.author_name}
                    </Box>
                    <Box
                      fontSize="sm"
                      color="gray.300"
                      fontStyle="italic"
                      _light={{ color: 'gray.400' }}
                    >
                      {item.description}
                    </Box>

                    <HStack
                      fontSize="sm"
                      color="gray.300"
                      spacing={2}
                      mt="auto"
                      pt={4}
                      _light={{ color: 'gray.400' }}
                    >
                      <Box>
                        {item.usages ? formatNumber(item.usages) : 'Never'} used
                      </Box>
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
        hidden={count <= pageSize && page === 1}
        _light={{
          borderColor: CustomColor.lightBorder,
        }}
      >
        <Box pl={2} color="gray.400">
          {pageFromTo.from === pageFromTo.to || pageFromTo.to > count ? (
            <>
              Results: {formatLocaleNumber(count)} of{' '}
              {formatLocaleNumber(count)}
            </>
          ) : (
            <>
              Results: {formatLocaleNumber(pageFromTo.from)} -{' '}
              {formatLocaleNumber(pageFromTo.to)} of {formatLocaleNumber(count)}
            </>
          )}
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
            isDisabled={isLastPage}
          >
            Next
          </Button>
        </ButtonGroup>
      </Flex>
    </>
  );
};
