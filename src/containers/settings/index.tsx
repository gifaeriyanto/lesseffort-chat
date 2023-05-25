import React from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorMode,
  useMediaQuery,
} from '@chakra-ui/react';
import { ChatSettings } from 'containers/chat/chatSettings';
import { APIKeySettings } from 'containers/settings/apiKey';
import ReactGA from 'react-ga4';
import { TbArrowLeft, TbMoonFilled, TbSun } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import { CustomColor } from 'theme/foundations/colors';

export const SettingsContainer: React.FC = () => {
  const [isLessThanMd] = useMediaQuery('(max-width: 48em)');
  const { toggleColorMode, colorMode } = useColorMode();

  const handleToggleColorMode = () => {
    toggleColorMode();
    ReactGA.event({
      action: `Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`,
      category: 'UX',
      label: isLessThanMd ? 'mobile' : 'desktop',
    });
  };

  return (
    <Container maxW="container.lg">
      <Flex
        pt={8}
        pb={2}
        borderBottom="1px solid"
        borderColor={CustomColor.border}
        justify="space-between"
        _light={{
          borderColor: CustomColor.lightBorder,
        }}
      >
        <Button
          leftIcon={<TbArrowLeft />}
          variant="link"
          colorScheme="blue"
          as={Link}
          to="/"
        >
          Back
        </Button>

        <IconButton
          variant="ghost"
          icon={colorMode === 'light' ? <TbMoonFilled /> : <TbSun />}
          aria-label="Toggle color mode"
          onClick={handleToggleColorMode}
          color="gray.400"
        />
      </Flex>
      <Heading pt={8} pb={4}>
        Settings
      </Heading>

      <Tabs>
        <TabList _light={{ borderColor: CustomColor.lightBorder }}>
          <Tab>Chat</Tab>
          <Tab>API Key</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <ChatSettings isGlobalSetting />
          </TabPanel>
          <TabPanel px={0}>
            <APIKeySettings />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};
