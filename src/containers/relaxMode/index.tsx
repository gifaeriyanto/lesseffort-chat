import React from 'react';
import { AspectRatio, Box } from '@chakra-ui/react';

export const RelaxModeContainer: React.FC = () => {
  return (
    <AspectRatio w="full" h="100vh" ratio={16 / 9} overflow="hidden">
      <Box
        as="iframe"
        transform="scale(130%)"
        title="background"
        src="//www.youtube.com/embed/l4D6OmkUygw?rel=0&autoplay=1&controls=0"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
        allowFullScreen
      />
    </AspectRatio>
  );
};
