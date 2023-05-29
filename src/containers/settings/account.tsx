import React, { useLayoutEffect, useRef } from 'react';
import {
  Avatar,
  AvatarProps,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  Image,
  LightMode,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { standaloneToast } from 'index';
import { props } from 'ramda';
import { useForm } from 'react-hook-form';
import { TbUser } from 'react-icons/tb';
import { getFileUrl, uploadFile } from 'store/supabase/bucket';
import { useProfilePhoto, useUserData } from 'store/user';
import { accentColor } from 'theme/foundations/colors';

export const AccountSettings: React.FC = () => {
  const { user } = useUserData();
  const { photo, getPhoto } = useProfilePhoto();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      </VStack>
    </>
  );
};
