import React, { useRef } from 'react';
import {
  Avatar,
  AvatarProps,
  Box,
  BoxProps,
  Flex,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import { TbUser } from 'react-icons/tb';
import { useProfilePhoto, useUserData } from 'store/openai';
import { accentColor } from 'theme/foundations/colors';

export interface ProfilePhotoProps extends BoxProps {
  allowChangePhoto?: boolean;
}

export const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
  allowChangePhoto,
  ...props
}) => {
  const { user } = useUserData();
  const { photo, setPhoto } = useProfilePhoto();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTriggerUpload = () => {
    if (allowChangePhoto) {
      fileInputRef.current?.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      const reader = new FileReader();

      reader.onload = function (event) {
        if (typeof event.target?.result !== 'string') {
          return;
        }
        setPhoto(event.target?.result);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {photo ? (
        <Avatar
          name={user?.name}
          src={photo}
          w="2.188rem"
          h="2.188rem"
          role={allowChangePhoto ? 'button' : 'none'}
          onClick={handleTriggerUpload}
          border={allowChangePhoto ? undefined : '3px solid'}
          color={allowChangePhoto ? undefined : accentColor('500')}
          {...(props as AvatarProps)}
        />
      ) : (
        <Tooltip label="Upload your own photo" openDelay={500}>
          <Flex
            p={4}
            bgColor="gray.500"
            w="2.188rem"
            h="2.188rem"
            align="center"
            justify="center"
            borderRadius="full"
            role={allowChangePhoto ? 'button' : 'none'}
            onClick={handleTriggerUpload}
            border={allowChangePhoto ? undefined : '2px solid'}
            borderColor={allowChangePhoto ? 'transparent' : accentColor('500')}
            _light={{ bgColor: allowChangePhoto ? 'gray.300' : 'gray.200' }}
            {...props}
          >
            <Icon as={TbUser} fontSize="2xl" color="gray.400" />
          </Flex>
        </Tooltip>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/jpeg, image/png"
        hidden
      />
    </>
  );
};
