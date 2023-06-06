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
  Icon,
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
import { captureException } from '@sentry/react';
import { ChatMessageAction } from 'components/chat/message';
import { Empty } from 'components/empty';
import { Search } from 'components/search';
import { CreatePrompt } from 'containers/chat/createPrompt';
import { TbFilter, TbThumbUp } from 'react-icons/tb';
import {
  defaultOrder,
  getPage,
  getPrompts,
  getPromptsCount,
  PromptData,
} from 'store/supabase';
import { accentColor, CustomColor } from 'theme/foundations/colors';
import {
  createIncrementArray,
  formatLocaleNumber,
  formatNumber,
} from 'utils/common';

export enum PromptCategory {
  'Copywriting' = 'Copywriting',
  'Generative AI' = 'Generative AI',
  'Marketing' = 'Marketing',
  'Productivity' = 'Productivity',
  'Software Engineering' = 'Software Engineering',
  'Other' = 'Other',
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
  const [prompts, setPrompts] = useState<PromptData[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(0);
  const [isLoading, { on: onLoading, off: offLoading }] = useBoolean();

  const pageFromTo = useMemo(() => {
    const { from, to } = getPage(page, pageSize);
    const _to = to + 1;
    return {
      from: from + 1,
      to: (_to > count ? count : _to) || pageSize,
    };
  }, [page]);

  useLayoutEffect(() => {
    setPage(1);
  }, [count, order]);

  useLayoutEffect(() => {
    onLoading();
    Promise.all([
      getPrompts({ page, pageSize, keyword, order, category }),
      getPromptsCount({ keyword, category }),
    ])
      .then((res) => {
        setPrompts((res[0].data as PromptData[]) || []);
        setCount(res[1].count || 0);
      })
      .catch(captureException)
      .finally(offLoading);
  }, [page, pageSize, keyword, order, category]);

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
          <CreatePrompt />
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
                      <option value="votes">Top votes</option>
                      <option value="views">Top views</option>
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
                      {item.category}
                    </Box>
                    <Box
                      fontSize="sm"
                      color="gray.300"
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
                      <Box>{formatNumber(item.usages)} used</Box>
                      <Box>.</Box>
                      <Flex align="center" gap={2}>
                        <Icon as={TbThumbUp} /> {formatNumber(item.votes)}
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
        _light={{
          borderColor: CustomColor.lightBorder,
        }}
      >
        <Box pl={2} color="gray.400">
          {pageFromTo.from === pageFromTo.to ? (
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
            isDisabled={count < pageSize}
          >
            Next
          </Button>
        </ButtonGroup>
      </Flex>
    </>
  );
};
