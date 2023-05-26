import React from 'react';
import {
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { SimpleNavbar } from 'components/navbar/simple';
import { ChatSettings } from 'containers/chat/chatSettings';
import { APIKeySettings } from 'containers/settings/apiKey';
import { CustomColor } from 'theme/foundations/colors';

export const SettingsContainer: React.FC = () => {
  return (
    <Container maxW="container.lg">
      <SimpleNavbar />
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
