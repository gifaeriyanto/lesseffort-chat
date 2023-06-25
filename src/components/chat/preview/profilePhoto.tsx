import React, { useLayoutEffect, useState } from 'react';
import { BoxProps, Flex, Icon, Image, ImageProps } from '@chakra-ui/react';
import { getFileUrl } from 'api/supabase/bucket';
import { TbUser } from 'react-icons/tb';

export interface ProfilePhotoProps extends BoxProps {
  name?: string;
  userId: string;
}

export const ProfilePhotoPreview: React.FC<ProfilePhotoProps> = ({
  name,
  userId,
  ...props
}) => {
  const [photo, setPhoto] = useState('');

  useLayoutEffect(() => {
    getFileUrl(userId).then((imageUrl) => imageUrl && setPhoto(imageUrl));
  }, []);

  return (
    <>
      {photo ? (
        <Image
          alt={name || 'profile photo'}
          src={photo}
          w="2.188rem"
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
