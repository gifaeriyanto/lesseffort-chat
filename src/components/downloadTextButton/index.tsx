import React from 'react';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  IconButtonProps,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { accentColor } from 'theme/foundations/colors';

interface DownloadTextButtonProps extends IconButtonProps {
  text: string;
  lang: string;
}

interface FormInputs {
  filename: string;
}

export const DownloadTextButton: React.FC<DownloadTextButtonProps> = ({
  text,
  lang,
  ...props
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormInputs>();

  const langParser = () => {
    switch (lang) {
      case 'javascript':
        return 'js';

      case 'python':
        return 'py';

      default:
        return lang || 'txt';
    }
  };

  const downloadFile = (filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.download = filename;
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleDownload = ({ filename }: FormInputs) => {
    downloadFile(filename);
    onClose();
    reset();
  };

  return (
    <>
      <IconButton onClick={onOpen} {...props} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Download as file</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(handleDownload)}>
            <ModalBody pb={6}>
              <FormControl isInvalid={!!errors.filename} mb={4}>
                <FormLabel>File name</FormLabel>
                <Input
                  defaultValue={`file.${langParser()}`}
                  {...register('filename', {
                    required: {
                      message: 'Filename cannot be empty',
                      value: true,
                    },
                  })}
                />
                {errors.filename && (
                  <FormErrorMessage>
                    {errors.filename?.message}
                  </FormErrorMessage>
                )}
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme={accentColor()} mr={3} type="submit">
                Download
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
