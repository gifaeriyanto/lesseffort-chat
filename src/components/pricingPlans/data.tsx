import { Icon } from '@chakra-ui/react';
import { TbCheck, TbX } from 'react-icons/tb';
import { accentColor } from 'theme/foundations/colors';

export const pricingData = {
  features: {
    free: [
      'Your own OpenAI API key',
      'Max 5 chat history',
      'Unlimited starter prompts usage',
      ['Chat rules', '170+ language, tone, writing style and format'],
      'Light mode & dark mode',
      'Relax mode',
      'Custom font size',
    ],
    premium: [
      'Your own OpenAI API key',
      'Unlimited chat history',
      'Unlimited prompts library',
      'Save messages',
      'Save & Share conversations',
      'Custom accent color',
      'Lifetime updates!',
      'And much more...',
    ],
  },
};

export const featuresData: [
  string,
  string | JSX.Element,
  string | JSX.Element,
][] = [
  [
    'Your own OpenAI API key',
    <Icon
      key="create_prompts_premium"
      as={TbCheck}
      color={accentColor('500')}
      fontSize="xl"
    />,
    <Icon
      key="create_prompts_premium"
      as={TbCheck}
      color={accentColor('500')}
      fontSize="xl"
    />,
  ],
  [
    'Dark mode',
    <Icon
      key="create_prompts_premium"
      as={TbCheck}
      color={accentColor('500')}
      fontSize="xl"
    />,
    <Icon
      key="create_prompts_premium"
      as={TbCheck}
      color={accentColor('500')}
      fontSize="xl"
    />,
  ],
  ['Accent color', 'Blue only', '9 color options'],
  [
    'Relax mode',
    <Icon
      key="create_prompts_premium"
      as={TbCheck}
      color={accentColor('500')}
      fontSize="xl"
    />,
    <Icon
      key="create_prompts_premium"
      as={TbCheck}
      color={accentColor('500')}
      fontSize="xl"
    />,
  ],
  ['Chat history', 'Max 5', 'Unlimited'],
  [
    'Search history',
    <Icon key="search_history_free" as={TbX} color="gray.400" fontSize="xl" />,
    <Icon
      key="search_history_premium"
      as={TbCheck}
      color={accentColor('500')}
      fontSize="xl"
    />,
  ],
  [
    'Chat rules',
    <Icon
      key="chat_rules_free"
      as={TbCheck}
      color={accentColor('500')}
      fontSize="xl"
    />,
    <Icon
      key="chat_rules_premium"
      as={TbCheck}
      color={accentColor('500')}
      fontSize="xl"
    />,
  ],
  [
    'Access to community prompts',
    <Icon
      key="create_prompts_premium"
      as={TbCheck}
      color={accentColor('500')}
      fontSize="xl"
    />,
    <Icon
      key="create_prompts_premium"
      as={TbCheck}
      color={accentColor('500')}
      fontSize="xl"
    />,
  ],
  [
    'Create your own prompts',
    <Icon
      key="create_prompts_premium"
      as={TbCheck}
      color={accentColor('500')}
      fontSize="xl"
    />,
    <Icon
      key="create_prompts_premium"
      as={TbCheck}
      color={accentColor('500')}
      fontSize="xl"
    />,
  ],
  [
    'Favorite prompts',
    <Icon key="save_prompts_free" as={TbX} color="gray.400" fontSize="xl" />,
    <Icon
      key="save_prompts_premium"
      as={TbCheck}
      color={accentColor('500')}
      fontSize="xl"
    />,
  ],
  [
    'Save messages',
    <Icon key="save_messages_free" as={TbX} color="gray.400" fontSize="xl" />,
    <Icon
      key="save_messages_premium"
      as={TbCheck}
      color={accentColor('500')}
      fontSize="xl"
    />,
  ],
  [
    'Save and share conversations',
    <Icon
      key="share_conversations_free"
      as={TbX}
      color="gray.400"
      fontSize="xl"
    />,
    <Icon
      key="share_conversations_premium"
      as={TbCheck}
      color={accentColor('500')}
      fontSize="xl"
    />,
  ],
];
