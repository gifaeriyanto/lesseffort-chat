import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Link,
  Text,
  useBoolean,
  VStack,
} from '@chakra-ui/react';
import { getUser } from 'api/supabase/auth';
import { uploadFile } from 'api/supabase/bucket';
import { saveProfile } from 'api/supabase/profile';
import { TypingDots } from 'components/typingDots';
import { useForm } from 'react-hook-form';
import { useProfilePhoto, useUserData } from 'store/user';
import { accentColor } from 'theme/foundations/colors';
import { debounce } from 'utils/common';
import { shallow } from 'zustand/shallow';

interface FormInputs {
  link: string;
}

export const AccountSettings: React.FC = () => {
  const user = useUserData((state) => state.user, shallow);
  const { photo, getPhoto } = useProfilePhoto();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormInputs>();
  const [isSaving, { on, off }] = useBoolean();
  const [showSavingState, setShowSavingState] = useState(false);

  const debounceOnChange = debounce(
    (setter: Function, value: unknown) => setter(value),
    2000,
  );

  const handleSaveSettings = ({ link }: FormInputs) => {
    off();
    saveProfile({ link });
    setShowSavingState(true);
  };

  useLayoutEffect(() => {
    if (user?.id) {
      getPhoto(user.id);
    }
  }, [user]);

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      if (!user?.id) {
        return;
      }

      await uploadFile(user.id, file);
      await getPhoto(user.id);

      // clear input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <Box fontSize="xl" fontWeight="bold" mb={4}>
        <Text color={accentColor('500')} as="span">
          Account
        </Text>{' '}
        Settings
        <Text
          as="span"
          color={accentColor('500')}
          ml={2}
          hidden={!showSavingState || !!Object.keys(errors).length}
          fontSize="sm"
          fontWeight="normal"
        >
          {isSaving ? (
            <>
              Saving
              <TypingDots />
            </>
          ) : (
            'Saved'
          )}
        </Text>
      </Box>

      <VStack spacing={8}>
        <FormControl>
          <FormLabel>Profile photo</FormLabel>
          <Box
            borderRadius="xl"
            w="10rem"
            h="10rem"
            bgColor="gray.300"
            bgImage={photo || ''}
            bgPos="center"
            bgSize="cover"
            role="button"
            onClick={handleTriggerUpload}
            pos="relative"
            overflow="hidden"
            _after={{
              content: '"Upload new photo"',
              color: 'white',
              fontSize: 'sm',
              display: 'flex',
              h: 'full',
              w: 'full',
              bgColor: 'blackAlpha.700',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: photo ? 0 : 0.5,
            }}
            _hover={{ _after: { opacity: 1 } }}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="image/jpeg, image/png"
            hidden
          />
        </FormControl>

        <Box
          as="form"
          w="full"
          onSubmit={handleSubmit(handleSaveSettings)}
          onChange={(e) => {
            if (!showSavingState) {
              setShowSavingState(true);
            }
            on();
            debounceOnChange(handleSubmit(handleSaveSettings), e);
          }}
        >
          <VStack spacing={8}>
            <FormControl isInvalid={!!errors['link']}>
              <FormLabel>Your link</FormLabel>
              <Input
                defaultValue={user?.link || ''}
                placeholder="e.q. Twitter link"
                {...register('link')}
              />
              {errors['link'] && (
                <FormErrorMessage>{errors['link']?.message}</FormErrorMessage>
              )}
              <FormHelperText>
                This link will be applied to the name you provided in the
                starter prompt that you created.
              </FormHelperText>
            </FormControl>
          </VStack>
        </Box>
      </VStack>
    </>
  );
};
