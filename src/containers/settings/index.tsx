import React from 'react';
import {
  Container,
  Heading,
  LightMode,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorMode,
} from '@chakra-ui/react';
import { SimpleNavbar } from 'components/navbar/simple';
import { ChatSettings } from 'containers/chat/chatSettings';
import { APIKeySettings } from 'containers/settings/apiKey';
import { GeneralSettings } from 'containers/settings/general';
import { accentColor, CustomColor } from 'theme/foundations/colors';

export const SettingsContainer: React.FC = () => {
  const { colorMode } = useColorMode();

  return (
    <Container maxW="container.lg">
      <SimpleNavbar />
      <Heading pt={8} pb={4}>
        Settings
      </Heading>

      <Tabs colorScheme={accentColor()}>
        <LightMode>
          <TabList
            borderColor={
              colorMode === 'light' ? CustomColor.lightBorder : 'inherit'
            }
            _active={{
              button: {
                bgColor: 'transparent',
              },
            }}
            sx={{
              button: {
                color: 'gray.400',
                _selected: {
                  fontWeight: 'bold',
                  color: colorMode === 'light' ? 'gray.500' : 'gray.200',
                  borderColor: accentColor('500'),
                },
              },
            }}
          >
            <Tab>General</Tab>
            <Tab>Chat</Tab>
            <Tab>API Key</Tab>
          </TabList>
        </LightMode>

        <TabPanels>
          <TabPanel px={0}>
            <GeneralSettings />
          </TabPanel>
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
