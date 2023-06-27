import React, { useState } from 'react';
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  TabProps,
  Tabs,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import { PromptData } from 'api/supabase/prompts';
import { ChatSettings } from 'containers/chat/chatSettings';
import { StarterPrompts } from 'containers/chat/starterPrompts';
import { TbSettings, TbTemplate } from 'react-icons/tb';
import { usePrompts } from 'store/prompt';
import { accentColor, CustomColor } from 'theme/foundations/colors';

export interface StarterContainerProps {
  onSelectPrompt: (prompt: PromptData) => void;
}

export const StarterContainer: React.FC<StarterContainerProps> = ({
  onSelectPrompt,
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [isLessThanMd] = useMediaQuery('(max-width: 48em)');
  const { isManagingPrompt } = usePrompts();

  const tabProps = (index: number): TabProps => ({
    borderWidth: { base: '0 0 2px 0', md: '0 2px 0 0' },
    borderStyle: 'solid',
    borderColor: tabIndex === index ? accentColor('500') : 'gray.500',
    color: tabIndex === index ? accentColor('500') : 'gray.400',
    py: 4,
    _light: {
      borderColor:
        tabIndex === index ? accentColor('500') : CustomColor.lightBorder,
    },
    _focus: {
      boxShadow: 'none',
    },
  });

  const wrapperPadding = { base: '1rem', md: '0 2rem 2rem 2rem' };

  if (localStorage.getItem('lastOpenChatId') && !isManagingPrompt) {
    return null;
  }

  return (
    <Tabs
      variant="unstyled"
      onChange={setTabIndex}
      mt={{ base: '0 !important', md: '2rem !important' }}
      w="full"
    >
      <Grid
        templateColumns={{ base: '1fr', md: '2rem 1fr' }}
        gap={{ base: 0, md: 4 }}
      >
        <GridItem>
          <TabList p={{ base: '1rem', md: 'initial' }}>
            <Flex direction={{ md: 'column' }}>
              <Tab {...tabProps(0)}>
                <Icon as={TbTemplate} />
                <Text ml={2} hidden={!isLessThanMd}>
                  Starter Prompts
                </Text>
              </Tab>
              <Tab {...tabProps(1)}>
                <Icon as={TbSettings} />
                <Text ml={2} hidden={!isLessThanMd}>
                  Chat Settings
                </Text>
              </Tab>
            </Flex>
          </TabList>
        </GridItem>

        <GridItem>
          <TabPanels>
            <TabPanel p={wrapperPadding}>
              <StarterPrompts onSelectPrompt={onSelectPrompt} />
            </TabPanel>
            <TabPanel p={wrapperPadding}>
              <ChatSettings />
            </TabPanel>
          </TabPanels>
        </GridItem>
      </Grid>
    </Tabs>
  );
};
