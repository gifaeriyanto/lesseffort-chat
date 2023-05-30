import React from 'react';
import { BoxProps, Flex, Icon, Image, ImageProps } from '@chakra-ui/react';
import { TbUser } from 'react-icons/tb';

export interface ProfilePhotoProps extends BoxProps {
  name?: string;
  photo?: string | null;
}

export const ProfilePhotoPreview: React.FC<ProfilePhotoProps> = ({
  name,
  photo,
  ...props
}) => {
  return (
    <>
      {photo ? (
        <Image
          alt={name || 'profile photo'}
          src={photo}
          w="2.188rem"
          h="2.188rem"
          borderRadius="full"
          {...(props as ImageProps)}
        />
      ) : (
        <Flex
          p={4}
          bgColor="gray.500"
          w="2.188rem"
          h="2.188rem"
          align="center"
          justify="center"
          borderRadius="full"
          _light={{ bgColor: 'gray.300' }}
          {...props}
        >
          <Icon as={TbUser} fontSize="2xl" color="gray.400" />
        </Flex>
      )}
    </>
  );
};
