import React from 'react';
import {
  Container,
  Heading,
  TabPanel,
  TabPanels,
  Tabs,
  useColorMode,
} from '@chakra-ui/react';
import { SimpleNavbar } from 'components/navbar/simple';
import { CustomTabList } from 'components/tabs/tabList';
import { ChatSettings } from 'containers/chat/chatSettings';
import { AccountSettings } from 'containers/settings/account';
import { APIKeySettings } from 'containers/settings/apiKey';
import { GeneralSettings } from 'containers/settings/general';
import { accentColor } from 'theme/foundations/colors';

export const SettingsContainer: React.FC = () => {
  const { colorMode } = useColorMode();

  return (
    <Container maxW="container.lg">
      <SimpleNavbar />
      <Heading pt={8} pb={4}>
        Settings
      </Heading>

      <Tabs colorScheme={accentColor()}>
        <CustomTabList list={['general', 'account', 'chat', 'api key']} />

        <TabPanels>
          <TabPanel px={0}>
            <GeneralSettings />
          </TabPanel>
          <TabPanel px={0}>
            <AccountSettings />
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
