import React, { useRef, useState } from 'react';
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
  useBoolean,
} from '@chakra-ui/react';
import { reverse } from 'ramda';
import { SiYoutube } from 'react-icons/si';
import {
  TbPlayerPause,
  TbPlayerPlay,
  TbSettings,
  TbVolume,
  TbVolumeOff,
} from 'react-icons/tb';
import YouTube from 'react-youtube';

const VIDEO_QUALITY_LEVELS = [720, 1080, 1440, 2160];

export const YoutubeSection: React.FC = () => {
  const [youtubeID, setYoutubeID] = useState('sUwD3GRPJos');
  const [youtubeData, setYoutubeData] = useState({
    title: '',
    quality: '',
    duration: 0,
    thumbnailUrl: '',
  });
  const [youtubeMuted, { toggle: toggleYoutubeMute }] = useBoolean(true);
  const [youtubePlay, { on: onYoutubePlay, off: offYoutubePlay }] =
    useBoolean(true);
  const [maxQualityLevel, setMaxQualityLevel] = useState(0);
  const [scale, setScale] = useState('120');
  const playerRef = useRef<any>(null);

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
      loop: 1,
    },
  };

  return (
    <>
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
          <HStack spacing={1} w="full">
            <Input
              width="full"
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
                    <Grid templateColumns="1fr 2fr" alignItems="center" gap={4}>
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
                            onChange={(e) => setScale(e.currentTarget.value)}
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
    </>
  );
};
