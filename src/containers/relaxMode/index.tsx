import React, { useState } from 'react';
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Icon,
  Link as CLink,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  TabProps,
  Tabs,
  useColorMode,
} from '@chakra-ui/react';
import { ClockWidget } from 'containers/relaxMode/sections/clock';
import { YoutubeSection } from 'containers/relaxMode/sections/youtube';
import { TbMessage, TbMoon, TbNotebook, TbSun } from 'react-icons/tb';
import { CustomColor } from 'theme/foundations/colors';

export const RelaxModeContainer: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const tabProps = (index: number): TabProps => ({
    w: '3rem',
    h: '3rem',
    border: '1px solid',
    borderColor: index === activeTabIndex ? 'whiteAlpha.600' : 'whiteAlpha.300',
    borderRadius: 'lg',
    m: 4,
    mb: 0,
    bgColor: index === activeTabIndex ? 'whiteAlpha.300' : 'transparent',
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
          as={CLink}
          href="/"
        >
          <Box
            as="img"
            w="2.4rem"
            src="/favicon-32x32.png"
            alt="Logo Lesseffort"
          />
        </Flex>
        <ClockWidget />
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

      <YoutubeSection />
    </Box>
  );
};
