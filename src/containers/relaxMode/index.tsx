import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  AspectRatio,
  Box,
  Flex,
  Grid,
  GridItem,
  Icon,
  IconButton,
  Input,
  Link as CLink,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  TabProps,
  Tabs,
  useBoolean,
  useColorMode,
} from '@chakra-ui/react';
import { SiYoutube } from 'react-icons/si';
import {
  TbMessage,
  TbMoon,
  TbNotebook,
  TbSun,
  TbVolume,
  TbVolumeOff,
} from 'react-icons/tb';
import { Link } from 'react-router-dom';
import YouTube from 'react-youtube';
import { CustomColor } from 'theme/foundations/colors';

export const RelaxModeContainer: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [date, setDate] = useState(new Date());
  const [youtubeID, setYoutubeID] = useState('QbJBDABNKxY');
  const [youtubeMuted, { toggle: toggleYoutubeMute }] = useBoolean(true);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const playerRef = useRef<any>(null);

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
    borderColor: index === activeTabIndex ? 'blackAlpha.200' : 'whiteAlpha.300',
    borderRadius: 'lg',
    m: 4,
    mb: 0,
    bgColor: index === activeTabIndex ? 'blackAlpha.500' : 'transparent',
  });

  const handleMute = async () => {
    const player = playerRef.current.internalPlayer;
    const isMuted = await player.isMuted();
    toggleYoutubeMute();
    isMuted ? player.unMute() : player.mute();
  };

  useLayoutEffect(() => {
    const player = playerRef?.current?.internalPlayer;
    player.playVideo();
  }, [playerRef]);

  const youtubePlayerOpts = {
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
    },
  };

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
          as={Link}
          to="/"
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
          onClick={toggleColorMode}
          hidden
        >
          {colorMode === 'light' ? <Icon as={TbMoon} /> : <Icon as={TbSun} />}
        </Flex>
      </Flex>

      <Box pos="absolute" bottom={4} left={4} zIndex={1}>
        <Flex
          align="center"
          h="3rem"
          p={4}
          pr={1}
          backdropFilter="blur(5px)"
          border="1px solid"
          borderColor="whiteAlpha.300"
          borderRadius="xl"
          fontSize="xl"
          _light={{ color: 'gray.100' }}
          gap={4}
        >
          <CLink href={`https://youtu.be/${youtubeID}`} target="_blank">
            <Icon as={SiYoutube} fontSize="2xl" mt={2} />
          </CLink>
          <Input
            variant="unstyled"
            value={youtubeID}
            onChange={(e) => setYoutubeID(e.currentTarget.value)}
          />
          <IconButton
            icon={youtubeMuted ? <TbVolume /> : <TbVolumeOff />}
            aria-label="Youtube mute"
            onClick={handleMute}
            variant="ghost"
            borderRadius="lg"
          />
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

      <AspectRatio
        w="full"
        h="100vh"
        ratio={16 / 9}
        overflow="hidden"
        sx={{
          iframe: {
            w: 'full',
            h: 'full',
            transform: 'scale(120%) rotateY(0deg)',
          },
        }}
      >
        <YouTube ref={playerRef} videoId={youtubeID} opts={youtubePlayerOpts} />
      </AspectRatio>
    </Box>
  );
};
