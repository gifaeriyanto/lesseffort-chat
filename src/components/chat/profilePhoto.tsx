import React, { useRef } from 'react';
import {
  Avatar,
  AvatarProps,
  BoxProps,
  Flex,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import { TbUser } from 'react-icons/tb';
import { useProfilePhoto } from 'store/openai';

export interface ProfilePhotoProps extends BoxProps {
  allowChangePhoto?: boolean;
}

export const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
  allowChangePhoto,
  ...props
}) => {
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
      {typeof photo === 'string' ? (
        <Avatar
          name="Demo"
          src={photo}
          w="2.188rem"
          h="2.188rem"
          role={allowChangePhoto ? 'button' : 'none'}
          onClick={handleTriggerUpload}
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
            _light={{ bgColor: 'gray.300' }}
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
