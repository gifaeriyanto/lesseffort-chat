import React, { useLayoutEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Icon,
  IconButton,
  Input,
  LightMode,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  Tooltip,
  useBoolean,
  useDisclosure,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react';
import {
  createPrompt,
  PromptData,
  PromptParams,
  updatePrompt,
} from 'api/supabase/prompts';
import { PromptCategory } from 'containers/chat/starterPrompts';
import { useForm } from 'react-hook-form';
import { TbInfoCircle, TbPlus } from 'react-icons/tb';
import { accentColor } from 'theme/foundations/colors';

type FormInputs = PromptParams & Pick<PromptData, 'id'>;

export interface CreatePromptProps {
  defaultValue?: PromptData;
  onSuccess?: () => void;
  onCloseModal?: () => void;
}

export const CreatePrompt: React.FC<CreatePromptProps> = ({
  defaultValue,
  onSuccess,
  onCloseModal,
}) => {
  const [isLessThanXl] = useMediaQuery('(max-width: 80em)');
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset: resetForm,
  } = useForm<FormInputs>();
  const [isLoading, { on, off }] = useBoolean();
  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose: () => {
      off();
      onCloseModal?.();
      resetForm();
    },
  });

  useLayoutEffect(() => {
    if (defaultValue) {
      onOpen();
    }
  }, [defaultValue]);

  const promptValidator = (value: string) => {
    if (!value.includes('[PROMPT]')) {
      return 'Prompt should contain "[PROMPT]".';
    }
    return true;
  };

  const handleSavePrompt = async (value: FormInputs) => {
    const _value = {
      ...value,
      status: value.status || 'private',
    };
    if (defaultValue?.id) {
      _value['id'] = defaultValue.id;
    }

    on();
    const fetcher = defaultValue ? updatePrompt : createPrompt;
    fetcher(_value)
      .then(onSuccess)
      .finally(() => {
        onClose();
        resetForm();
      });
  };

  return (
    <>
      <LightMode>
        {isLessThanXl ? (
          <IconButton
            icon={<TbPlus />}
            colorScheme={accentColor()}
            aria-label="Add yours"
            onClick={onOpen}
          />
        ) : (
          <Button
            fontSize="sm"
            leftIcon={<TbPlus />}
            colorScheme={accentColor()}
            onClick={onOpen}
          >
            Create prompt
          </Button>
        )}
      </LightMode>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex gap={2} align="center">
              <Box>
                <Text color={accentColor('500')} as="span">
                  {defaultValue ? 'Edit' : 'Create'}
                </Text>{' '}
                Prompt
              </Box>
              <Tooltip
                label="Be cautious of sharing confidential information as we are
                not liable for any actions taken by others based on it."
              >
                <Box display="inherit">
                  <Icon as={TbInfoCircle} />
                </Box>
              </Tooltip>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(handleSavePrompt)}>
            <ModalBody>
              <VStack spacing={4}>
                <SimpleGrid
                  columns={{ base: 1, md: 2 }}
                  spacing={4}
                  w="full"
                  alignItems="baseline"
                >
                  <FormControl isInvalid={!!errors.title}>
                    <FormLabel>Title</FormLabel>
                    <Input
                      defaultValue={defaultValue?.title}
                      {...register('title', {
                        required: {
                          message: 'Title cannot be empty',
                          value: true,
                        },
                      })}
                    />
                    {errors.title && (
                      <FormErrorMessage>
                        {errors.title?.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl isInvalid={!!errors.category}>
                    <FormLabel fontSize="sm">Category</FormLabel>
                    <Select
                      defaultValue={defaultValue?.category}
                      placeholder="Select category"
                      {...register('category', {
                        required: {
                          message: 'Please select a category',
                          value: true,
                        },
                      })}
                    >
                      {Object.values(PromptCategory).map((value) => (
                        <option value={value} key={value}>
                          {value}
                        </option>
                      ))}
                    </Select>
                    {errors.category && (
                      <FormErrorMessage>
                        {errors.category?.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </SimpleGrid>

                <FormControl isInvalid={!!errors.description}>
                  <FormLabel>Description</FormLabel>
                  <Input
                    defaultValue={defaultValue?.description}
                    {...register('description', {
                      required: {
                        message: 'Description cannot be empty',
                        value: true,
                      },
                      maxLength: {
                        message: 'Description cannot more than 200 characters',
                        value: 200,
                      },
                    })}
                  />
                  {errors.description && (
                    <FormErrorMessage>
                      {errors.description?.message}
                    </FormErrorMessage>
                  )}
                  <FormHelperText>
                    Provide a detailed explanation of this prompt to ensure that
                    users have a clear understanding of how to use it before
                    proceeding.
                  </FormHelperText>
                </FormControl>

                <FormControl isInvalid={!!errors.hint}>
                  <FormLabel>Hint</FormLabel>
                  <Input
                    defaultValue={defaultValue?.hint}
                    placeholder="e.q. Your keyword, Title for your article, etc."
                    {...register('hint', {
                      required: {
                        message: 'Hint cannot be empty',
                        value: true,
                      },
                      maxLength: {
                        message: 'Hint cannot more than 50 characters',
                        value: 50,
                      },
                    })}
                  />
                  {errors.hint && (
                    <FormErrorMessage>{errors.hint?.message}</FormErrorMessage>
                  )}
                  <FormHelperText>
                    Please instruct the user on what to input to replace the
                    "[PROMPT]" in the template.
                  </FormHelperText>
                </FormControl>

                <FormControl isInvalid={!!errors.prompt}>
                  <FormLabel>Prompt template</FormLabel>
                  <Textarea
                    defaultValue={defaultValue?.prompt}
                    placeholder="e.q. Fix grammar: [PROMPT]"
                    rows={10}
                    resize="none"
                    borderRadius="xl"
                    {...register('prompt', {
                      required: {
                        message: 'Prompt template cannot be empty',
                        value: true,
                      },
                      validate: promptValidator,
                    })}
                  />
                  {errors.prompt && (
                    <FormErrorMessage>
                      {errors.prompt?.message}
                    </FormErrorMessage>
                  )}
                  <FormHelperText>
                    Learn how to create prompt{' '}
                    <Link
                      color={accentColor('500')}
                      href="/docs/prompt"
                      target="_blank"
                    >
                      here
                    </Link>
                  </FormHelperText>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Flex justify="space-between" align="center" w="full" gap={8}>
                <FormControl isInvalid={!!errors.status}>
                  <Checkbox
                    defaultChecked={defaultValue?.status !== 'private'}
                    {...register('status')}
                    value="pending"
                  >
                    Set as public
                  </Checkbox>
                  {errors.status && (
                    <FormErrorMessage>
                      {errors.status?.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <LightMode>
                  <Button
                    colorScheme={accentColor()}
                    type="submit"
                    flexShrink={0}
                    isLoading={isLoading}
                  >
                    Save
                  </Button>
                </LightMode>
              </Flex>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
