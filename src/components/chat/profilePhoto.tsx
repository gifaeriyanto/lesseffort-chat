import React from 'react';
import { BoxProps, Flex, Icon, Image, ImageProps } from '@chakra-ui/react';
import { TbUser } from 'react-icons/tb';
import { useProfilePhoto, useUserData } from 'store/user';
import { shallow } from 'zustand/shallow';

export interface ProfilePhotoProps extends BoxProps {}

export const ProfilePhoto: React.FC<ProfilePhotoProps> = (props) => {
  const user = useUserData((state) => state.user, shallow);
  const { photo } = useProfilePhoto();

  return (
    <>
      {photo ? (
        <Image
          alt={user?.name}
          src={photo}
          w="2.188rem"
          maxW="2.188rem"
          h="2.188rem"
          borderRadius="full"
          objectFit="cover"
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
