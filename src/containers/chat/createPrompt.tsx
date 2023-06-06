import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  IconButton,
  Input,
  LightMode,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Textarea,
  Tooltip,
  useDisclosure,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react';
import { PromptCategory } from 'containers/chat/starterPrompts';
import { useForm } from 'react-hook-form';
import { TbInfoCircle, TbPlus } from 'react-icons/tb';
import { PromptData } from 'store/supabase';
import { accentColor } from 'theme/foundations/colors';

interface FormInputs
  extends Pick<PromptData, 'title' | 'category' | 'prompt' | 'status'> {}

export const CreatePrompt: React.FC = () => {
  const [isLessThanXl] = useMediaQuery('(max-width: 80em)');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormInputs>();

  const handleSaveTemplate = ({ title }: FormInputs) => {
    onClose();
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

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size="xl"
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex gap={2} align="center">
              <Box>Create Prompt</Box>
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
          <form onSubmit={handleSubmit(handleSaveTemplate)}>
            <ModalBody>
              <VStack spacing={4}>
                <SimpleGrid columns={2} spacing={8} w="full">
                  <FormControl isInvalid={!!errors.title}>
                    <FormLabel>Title</FormLabel>
                    <Input
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

                  <FormControl>
                    <FormLabel fontSize="sm">Category</FormLabel>
                    <Select {...register('category')}>
                      <option value="">All</option>
                      {Object.values(PromptCategory).map((value) => (
                        <option value={value} key={value}>
                          {value}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </SimpleGrid>

                <FormControl isInvalid={!!errors.prompt}>
                  <FormLabel>Prompt template</FormLabel>
                  <Textarea
                    rows={10}
                    resize="none"
                    borderRadius="xl"
                    {...register('prompt', {
                      required: {
                        message: 'Prompt template cannot be empty',
                        value: true,
                      },
                    })}
                  />
                  {errors.prompt && (
                    <FormErrorMessage>
                      {errors.prompt?.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Flex justify="space-between" align="center" w="full" gap={8}>
                <FormControl isInvalid={!!errors.status}>
                  <Checkbox
                    defaultChecked
                    {...register('status')}
                    value="public"
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
