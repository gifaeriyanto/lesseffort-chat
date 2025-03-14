import React from 'react';
import {
  Button,
  Flex,
  IconButton,
  LightMode,
  Link as CLink,
  useColorMode,
  useMediaQuery,
} from '@chakra-ui/react';
import ReactGA from 'react-ga4';
import { TbArrowLeft, TbMoonFilled, TbSun } from 'react-icons/tb';
import { Link, useLocation } from 'react-router-dom';
import { useUserData } from 'store/user';
import { accentColor, CustomColor } from 'theme/foundations/colors';
import { useGA } from 'utils/hooks/useGA';
import { shallow } from 'zustand/shallow';

export interface SimpleNavbarProps {
  backLink?: string;
}

export const SimpleNavbar: React.FC<SimpleNavbarProps> = ({ backLink }) => {
  const [isLessThanMd] = useMediaQuery('(max-width: 48em)');
  const { GAEvent } = useGA();
  const { toggleColorMode, colorMode } = useColorMode();
  const { pathname } = useLocation();

  const handleToggleColorMode = () => {
    toggleColorMode();
    GAEvent({
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
      <LightMode>
        {pathname === '/settings' ? (
          <Button
            leftIcon={<TbArrowLeft />}
            variant="link"
            colorScheme={accentColor()}
            as={CLink}
            href={backLink || '/'}
          >
            Back
          </Button>
        ) : (
          <Button
            leftIcon={<TbArrowLeft />}
            variant="link"
            colorScheme={accentColor()}
            as={Link}
            to={backLink || '/'}
          >
            Back
          </Button>
        )}
      </LightMode>

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
