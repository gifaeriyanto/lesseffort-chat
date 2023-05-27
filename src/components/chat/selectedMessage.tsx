import React from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  Icon,
  IconButton,
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
import { useForm } from 'react-hook-form';
import { IconType } from 'react-icons';
import { TbTemplate, TbX } from 'react-icons/tb';
import { accentColor, CustomColor } from 'theme/foundations/colors';

export interface SelectedMessageProps {
  title: string;
  icon: IconType;
  info?: React.ReactNode;
  onClose: () => void;
  template?: string;
  onSaveTemplate?: (template: string) => void;
}

interface FormInputs {
  template: string;
}

export const SelectedMessage: React.FC<SelectedMessageProps> = ({
  title,
  icon,
  info,
  onClose,
  template,
  onSaveTemplate,
}) => {
  const { isOpen, onOpen, onClose: onCloseModal } = useDisclosure();
  const { register, handleSubmit } = useForm<FormInputs>();

  const handleSaveTemplate = ({ template: value }: FormInputs) => {
    onSaveTemplate?.(value);
    onCloseModal();
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
          {!!template && (
            <IconButton
              icon={<TbTemplate />}
              aria-label="Edit template"
              variant="ghost"
              fontSize="xl"
              color={accentColor('500')}
              onClick={onOpen}
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
              <FormControl>
                <Textarea
                  rows={20}
                  {...register('template')}
                  resize="none"
                  borderRadius="xl"
                  defaultValue={template}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button mr={3} variant="ghost" onClick={onCloseModal}>
                Cancel
              </Button>
              <Button colorScheme={accentColor()} type="submit">
                Save
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
