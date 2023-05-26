import React from 'react';
import {
  Button,
  Flex,
  IconButton,
  Link,
  useColorMode,
  useMediaQuery,
} from '@chakra-ui/react';
import ReactGA from 'react-ga4';
import { TbArrowLeft, TbMoonFilled, TbSun } from 'react-icons/tb';
import { CustomColor } from 'theme/foundations/colors';

export interface SimpleNavbarProps {
  backLink?: string;
}

export const SimpleNavbar: React.FC<SimpleNavbarProps> = ({ backLink }) => {
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
        href={backLink || '/'}
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
  );
};
