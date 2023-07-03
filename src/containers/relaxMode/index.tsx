import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  AspectRatio,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link as CLink,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  TabProps,
  Tabs,
  useBoolean,
  useColorMode,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { reverse } from 'ramda';
import { SiYoutube } from 'react-icons/si';
import {
  TbMessage,
  TbMoon,
  TbNotebook,
  TbPlayerPause,
  TbPlayerPlay,
  TbSettings,
  TbSun,
  TbVolume,
  TbVolumeOff,
} from 'react-icons/tb';
import { Link } from 'react-router-dom';
import YouTube from 'react-youtube';
import { CustomColor } from 'theme/foundations/colors';

const VIDEO_QUALITY_LEVELS = [720, 1080, 1440, 2160];

export const RelaxModeContainer: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [date, setDate] = useState(new Date());
  const [youtubeID, setYoutubeID] = useState('QbJBDABNKxY');
  const [youtubeData, setYoutubeData] = useState({
    title: '',
    quality: '',
    duration: 0,
    thumbnailUrl: '',
  });
  const [youtubeMuted, { toggle: toggleYoutubeMute }] = useBoolean(true);
  const [youtubePlay, { on: onYoutubePlay, off: offYoutubePlay }] =
    useBoolean(true);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [maxQualityLevel, setMaxQualityLevel] = useState(0);
  const [scale, setScale] = useState('120');
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

  const handlePlay = async () => {
    const player = playerRef.current.internalPlayer;
    const playerState = await player.getPlayerState();
    if (playerState === 1) {
      offYoutubePlay();
      player.pauseVideo();
    } else {
      onYoutubePlay();
      player.playVideo();
    }
  };

  const handleChangeQuality = (value: string) => {
    const player = playerRef?.current?.internalPlayer;
    player.setPlaybackQuality(value);
  };

  const extractNumberFromString = (str: string) => {
    var numString = str.replace(/[^0-9]/g, '');
    var number = parseInt(numString);
    return number;
  };

  const handlePlayerReady = async () => {
    const player = playerRef?.current?.internalPlayer;
    await player.getPlaybackQuality().then((value: string) => {
      const resolution = extractNumberFromString(value);
      setMaxQualityLevel(resolution);
    });
    const res = await player.playVideo();
    if (res?.playerInfo?.videoData?.title) {
      const thumbnailUrl =
        res.playerInfo.videoUrl.replace(
          'https://www.youtube.com/watch?v=',
          'https://img.youtube.com/vi/',
        ) + '/0.jpg';
      setYoutubeData({
        title: res.playerInfo.videoData.title,
        quality: res.playerInfo.videoData.video_quality,
        duration: res.playerInfo.duration,
        thumbnailUrl,
      });
    }
  };

  const youtubePlayerOpts = {
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      rel: 0,
      defaultPlaybackQuality: 'highres',
    },
  };

  return (
    <Box pos="relative">
      {youtubeData.title && (
        <>
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
              {colorMode === 'light' ? (
                <Icon as={TbMoon} />
              ) : (
                <Icon as={TbSun} />
              )}
            </Flex>
          </Flex>

          <Box pos="absolute" bottom={4} left={4} zIndex={1}>
            <Flex
              align="center"
              p={4}
              backdropFilter="blur(5px)"
              border="1px solid"
              borderColor="whiteAlpha.300"
              borderRadius="xl"
              fontSize="xl"
              _light={{ color: 'gray.100' }}
              gap={4}
              mb={4}
              w="fit-content"
            >
              <CLink
                href={`https://youtu.be/${youtubeID}`}
                target="_blank"
                _hover={{ textDecor: 'none' }}
              >
                <Flex width="25rem" gap={4}>
                  <Box
                    as="img"
                    src={youtubeData.thumbnailUrl}
                    w="10rem"
                    h="10rem"
                    objectFit="cover"
                    borderRadius="lg"
                  />
                  <Box maxH="6rem" overflow="hidden" title={youtubeData.title}>
                    {youtubeData.title}
                  </Box>
                </Flex>
              </CLink>
            </Flex>
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
              <HStack spacing={1}>
                <Input
                  width="200px"
                  variant="unstyled"
                  value={youtubeID}
                  onChange={(e) => setYoutubeID(e.currentTarget.value)}
                />
                <IconButton
                  icon={youtubePlay ? <TbPlayerPause /> : <TbPlayerPlay />}
                  aria-label="Youtube mute"
                  onClick={handlePlay}
                  variant="ghost"
                  borderRadius="lg"
                />
                <IconButton
                  icon={youtubeMuted ? <TbVolume /> : <TbVolumeOff />}
                  aria-label="Youtube mute"
                  onClick={handleMute}
                  variant="ghost"
                  borderRadius="lg"
                />
                <Popover>
                  <PopoverTrigger>
                    <IconButton
                      icon={<TbSettings />}
                      aria-label="Youtube mute"
                      variant="ghost"
                      borderRadius="lg"
                    />
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverBody>
                        <Grid
                          templateColumns="1fr 2fr"
                          alignItems="center"
                          gap={4}
                        >
                          <GridItem hidden fontSize="md">
                            Quality
                          </GridItem>
                          <GridItem hidden>
                            <Select
                              onChange={(e) =>
                                handleChangeQuality(e.currentTarget.value)
                              }
                            >
                              <option value="0">Auto</option>
                              {reverse(VIDEO_QUALITY_LEVELS)
                                .filter((item) => item <= maxQualityLevel)
                                .map((item) => (
                                  <option value={`hd${item}`} key={item}>
                                    {item}p
                                  </option>
                                ))}
                            </Select>
                          </GridItem>

                          <GridItem fontSize="md">Scale</GridItem>
                          <GridItem>
                            <InputGroup size="md">
                              <InputLeftElement>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    setScale((prev) => {
                                      if (Number(prev) <= 100) {
                                        return prev;
                                      }
                                      return String(Number(prev) - 5);
                                    })
                                  }
                                >
                                  -
                                </Button>
                              </InputLeftElement>
                              <Input
                                readOnly
                                textAlign="center"
                                type="number"
                                step={5}
                                min={100}
                                value={scale}
                                onChange={(e) =>
                                  setScale(e.currentTarget.value)
                                }
                              />
                              <InputRightElement>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    setScale((prev) => String(Number(prev) + 5))
                                  }
                                >
                                  +
                                </Button>
                              </InputRightElement>
                            </InputGroup>
                          </GridItem>
                        </Grid>
                      </PopoverBody>
                    </PopoverContent>
                  </Portal>
                </Popover>
              </HStack>
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
            <Tabs
              variant="unstyled"
              onChange={setActiveTabIndex}
              w="full"
              h="full"
            >
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
                        w="355px"
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
                        w="355px"
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
        </>
      )}

      <AspectRatio
        w="full"
        h="100vh"
        ratio={16 / 9}
        overflow="hidden"
        sx={{
          iframe: {
            w: 'full',
            h: 'full',
            transform: `scale(${scale}%) rotateY(0deg)`,
          },
        }}
        pointerEvents="none"
      >
        <YouTube
          ref={playerRef}
          videoId={youtubeID}
          opts={youtubePlayerOpts}
          onReady={handlePlayerReady}
          key={youtubeID}
        />
      </AspectRatio>
    </Box>
  );
};
