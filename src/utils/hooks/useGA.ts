import ReactGA from 'react-ga4';
import { UaEventOptions } from 'react-ga4/types/ga4';
import { useUserData } from 'store/user';
import { shallow } from 'zustand/shallow';

export const useGA = () => {
  const userData = useUserData((state) => state.user, shallow);

  return {
    GAEvent: (options: string | UaEventOptions) => {
      ReactGA.event(
        options,
        userData
          ? {
              id: userData?.id,
              name: userData?.name,
              plan: userData?.plan,
              status: userData?.status_formatted,
            }
          : undefined,
      );
    },
  };
};
