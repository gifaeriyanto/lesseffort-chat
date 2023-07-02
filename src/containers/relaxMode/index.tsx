import React, { useLayoutEffect, useState } from 'react';
import {
  AspectRatio,
  Box,
  Flex,
  Grid,
  GridItem,
  Icon,
  Input,
  Link,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  TabProps,
  Tabs,
} from '@chakra-ui/react';
import { SiYoutube } from 'react-icons/si';
import { TbExternalLink, TbMessage, TbNotebook } from 'react-icons/tb';
import { CustomColor } from 'theme/foundations/colors';

export const RelaxModeContainer: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const [youtubeID, setYoutubeID] = useState('QbJBDABNKxY');
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const refreshClock = () => {
    setDate(new Date());
  };

  useLayoutEffect(() => {
    const timerId = setInterval(refreshClock, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);

  const tabProps = (index: number): TabProps => ({
    w: '3rem',
    h: '3rem',
    border: '1px solid',
    borderColor: 'whiteAlpha.300',
    borderRadius: 'lg',
    m: 4,
    mb: 0,
    bgColor: index === activeTabIndex ? 'blackAlpha.500' : 'transparent',
  });

  return (
    <Box pos="relative">
      <Flex pos="absolute" zIndex={1} top={4} left={4} gap={4}>
        <Flex
          align="center"
          gap={4}
          cursor="pointer"
          w="3rem"
          h="3rem"
          p="0.6rem"
          backdropFilter="blur(5px)"
          border="1px solid"
          borderColor="whiteAlpha.300"
          borderRadius="xl"
          flexShrink={0}
        >
          <Box
            as="img"
            w="2.4rem"
            src="/favicon-32x32.png"
            alt="Logo Lesseffort"
          />
        </Flex>
        <Flex
          align="center"
          h="3rem"
          p={4}
          backdropFilter="blur(5px)"
          border="1px solid"
          borderColor="whiteAlpha.300"
          borderRadius="xl"
          fontSize="xl"
          _light={{ color: 'gray.100' }}
        >
          {date.toLocaleTimeString()}
        </Flex>
      </Flex>

      <Box pos="absolute" bottom={4} left={4} zIndex={1}>
        <Flex
          align="center"
          h="3rem"
          p={4}
          backdropFilter="blur(5px)"
          border="1px solid"
          borderColor="whiteAlpha.300"
          borderRadius="xl"
          fontSize="xl"
          _light={{ color: 'gray.100' }}
          gap={4}
        >
          <Icon as={SiYoutube} fontSize="2xl" />
          <Input
            variant="unstyled"
            value={youtubeID}
            onChange={(e) => setYoutubeID(e.currentTarget.value)}
          />
          <Link href={`https://youtu.be/${youtubeID}`} target="_blank">
            <Icon as={TbExternalLink} />
          </Link>
        </Flex>
      </Box>

      <Box
        pos="absolute"
        right={4}
        top={4}
        zIndex={1}
        h="calc(100vh - 2rem)"
        backdropFilter="blur(5px)"
        border="1px solid"
        borderColor="whiteAlpha.300"
        borderRadius="xl"
        overflow="hidden"
      >
        <Tabs variant="unstyled" onChange={setActiveTabIndex} w="full" h="full">
          <Grid templateColumns="3.8rem 1fr" h="full">
            <GridItem>
              <TabList>
                <Flex direction={{ md: 'column' }}>
                  <Tab {...tabProps(0)}>
                    <Icon as={TbMessage} />
                  </Tab>
                  <Tab {...tabProps(1)}>
                    <Icon as={TbNotebook} />
                  </Tab>
                </Flex>
              </TabList>
            </GridItem>
            <GridItem>
              <TabPanels h="full" pl={4}>
                <TabPanel h="full" p={0}>
                  <Box
                    as="iframe"
                    w="354px"
                    h="full"
                    borderLeft="1px solid"
                    borderColor="whiteAlpha.300"
                    title="background"
                    src="/?relax-mode=1"
                    frameBorder="0"
                    bgColor={CustomColor.background}
                    _light={{
                      bgColor: 'gray.200',
                    }}
                  />
                </TabPanel>

                <TabPanel h="full" p={0}>
                  <Flex
                    w="354px"
                    p={4}
                    justify="center"
                    align="center"
                    h="full"
                    borderLeft="1px solid"
                    borderColor="whiteAlpha.300"
                  >
                    Coming soon
                  </Flex>
                </TabPanel>
              </TabPanels>
            </GridItem>
          </Grid>
        </Tabs>
      </Box>

      <AspectRatio w="full" h="100vh" ratio={16 / 9} overflow="hidden">
        <Box
          as="iframe"
          transform="scale(120%)"
          title="background"
          src="https://www.youtube.com/embed/QbJBDABNKxY?autoplay=1&controls=0&mute=0&rel=0&disablekb=1"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
          allowFullScreen
        />
      </AspectRatio>
    </Box>
  );
};
