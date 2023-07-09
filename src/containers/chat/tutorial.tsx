import React from 'react';
import { Box, Grid, GridItem, Image, Text } from '@chakra-ui/react';
import { accentColor } from 'theme/foundations/colors';

const videos = [
  {
    title: 'Prompt Creation',
    id: '-8dX5QQtIac',
  },
  {
    title: 'Relax Mode',
    id: 'hFYcSCcFt8E',
  },
  {
    title: 'Quick Settings',
    id: '1o0jjmGu49E',
  },
  {
    title: 'Save and Share Your Conversation',
    id: 'XJper95Ixlk',
  },
  {
    title: 'Changing GPT Model',
    id: 'dxfVN48nztA',
  },
  {
    title: 'Customizing Settings and Appearance',
    id: '21_iAxbvhV8',
  },
];

export const Tutorial: React.FC = () => {
  return (
    <>
      <Box fontSize="xl" fontWeight="bold">
        Get to know{' '}
        <Text color={accentColor('500')} as="span">
          LessEffort
        </Text>
      </Box>

      <Box color="gray.400" fontSize="sm" mb={8}>
        Learn where the tools are and how they work
      </Box>

      <Grid
        templateColumns={{
          base: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
          xl: 'repeat(4, 1fr)',
        }}
        gap={8}
      >
        {videos.map((item) => (
          <GridItem
            key={item.id}
            as="a"
            href={`https://youtu.be/${item.id}`}
            target="_blank"
          >
            <Image
              borderRadius="lg"
              w="full"
              h="8rem"
              objectFit="cover"
              src={`https://img.youtube.com/vi/${item.id}/mqdefault.jpg`}
              alt={item.title}
            />
            <Box mt={4}>{item.title}</Box>
          </GridItem>
        ))}
      </Grid>
    </>
  );
};
