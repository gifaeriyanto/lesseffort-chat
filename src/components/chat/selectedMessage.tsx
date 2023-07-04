import React from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Icon,
  IconButton,
  LightMode,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import { Message } from 'api/chat';
import { useForm } from 'react-hook-form';
import { IconType } from 'react-icons';
import { TbTemplate, TbX } from 'react-icons/tb';
import { useUserData } from 'store/user';
import { accentColor, CustomColor } from 'theme/foundations/colors';
import { toastForFreeUser } from 'utils/toasts';
import { shallow } from 'zustand/shallow';

export interface SelectedMessageProps {
  title: string;
  icon: IconType;
  info?: React.ReactNode;
  onClose: () => void;
  template?: string;
  templateData?: Message['templateData'];
  onSaveTemplate?: (template: string) => void;
}

interface FormInputs {
  prompt: string;
}

export const SelectedMessage: React.FC<SelectedMessageProps> = ({
  title,
  icon,
  info,
  onClose,
  template,
  templateData,
  onSaveTemplate,
}) => {
  const { isOpen, onOpen, onClose: onCloseModal } = useDisclosure();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormInputs>();
  const isFreeUser = useUserData((state) => state.isFreeUser, shallow);

  const handleSaveTemplate = ({ prompt }: FormInputs) => {
    onSaveTemplate?.(prompt);
    onCloseModal();
  };

  const promptValidator = (value: string) => {
    if (!value.includes('[PROMPT]')) {
      return 'Prompt should contain "[PROMPT]".';
    }
    return true;
  };

  return (
    <>
      <Flex
        align="center"
        py={2}
        maxW={{ base: 'calc(100vw - 2rem)', md: 'auto' }}
        borderTop="1px solid"
        borderColor={CustomColor.border}
        _light={{
          borderColor: CustomColor.lightBorder,
        }}
      >
        <Box w="4rem" textAlign="center" flexGrow="0" flexShrink="0">
          <Icon as={icon} fontSize="2xl" color={accentColor('500')} />
        </Box>
        <Box
          w="full"
          maxW="calc(100% - 8.25rem)"
          pl={4}
          borderLeft="1px solid"
          borderColor={accentColor('500')}
          flexGrow="0"
          flexShrink="1"
        >
          {!!info && (
            <Flex align="center" color={accentColor('500')}>
              {info}
            </Flex>
          )}
          <Box isTruncated maxW="100%">
            {title}
          </Box>
        </Box>
        <Flex align="center" mx={4} gap={4}>
          {!!template && templateData?.type !== 'direct' && (
            <IconButton
              icon={<TbTemplate />}
              aria-label="Edit template"
              variant="ghost"
              fontSize="xl"
              color={accentColor('500')}
              onClick={
                isFreeUser ? () => toastForFreeUser('no_edit_template') : onOpen
              }
            />
          )}
          <IconButton
            icon={<TbX />}
            aria-label="Cancel edit"
            variant="ghost"
            fontSize="xl"
            onClick={onClose}
          />
        </Flex>
      </Flex>

      <Modal isOpen={isOpen} onClose={onCloseModal} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Prompt</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(handleSaveTemplate)}>
            <ModalBody>
              <Alert
                mb={4}
                fontSize="sm"
                borderRadius="xl"
                status="info"
                alignItems="flex-start"
              >
                <AlertIcon />
                <AlertDescription>
                  Note: please don't remove [PROMPT] and any text in square
                  brackets as this will be overwritten with your message when
                  using our prompt templates. Keep them intact to ensure proper
                  formatting.
                </AlertDescription>
              </Alert>
              <FormControl isInvalid={!!errors.prompt}>
                <Textarea
                  rows={15}
                  resize="none"
                  borderRadius="xl"
                  defaultValue={template}
                  {...register('prompt', {
                    required: {
                      message: 'Prompt template cannot be empty',
                      value: true,
                    },
                    validate: promptValidator,
                  })}
                />
                {errors.prompt && (
                  <FormErrorMessage>{errors.prompt?.message}</FormErrorMessage>
                )}
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button mr={3} variant="ghost" onClick={onCloseModal}>
                Cancel
              </Button>
              <LightMode>
                <Button colorScheme={accentColor()} type="submit">
                  Save
                </Button>
              </LightMode>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
