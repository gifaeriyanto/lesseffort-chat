import React from 'react';
import { BoxProps, Flex, Icon, Image, ImageProps } from '@chakra-ui/react';
import { TbUser } from 'react-icons/tb';
import { useProfilePhoto, useUserData } from 'store/user';

export interface ProfilePhotoProps extends BoxProps {}

export const ProfilePhoto: React.FC<ProfilePhotoProps> = (props) => {
  const { user } = useUserData();
  const { photo } = useProfilePhoto();

  return (
    <>
      {photo ? (
        <Image
          alt={user?.name}
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
          _light={{ bgColor: 'gray.200' }}
          {...props}
        >
          <Icon as={TbUser} fontSize="2xl" color="gray.400" />
        </Flex>
      )}
    </>
  );
};
