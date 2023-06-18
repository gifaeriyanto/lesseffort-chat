export enum CustomColor {
  background = 'gray.700',
  card = 'gray.600',
  lightCard = 'gray.100',
  border = '#303435',
  lightBorder = '#c6d2d3',
}

export const accentColor = (
  density?:
    | '50'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900',
) => {
  const color = localStorage.getItem('accentColor') || 'blue';
  if (density) {
    return `${color}.${density}`;
  }
  return color;
};

export const colors = {
  blue: {
    100: '#CCF1FF',
    200: '#99DDFF',
    300: '#67C5FF',
    400: '#41ADFF',
    500: '#0285FF',
    600: '#0167DB',
    700: '#014CB7',
    800: '#003693',
    900: '#00267A',
  },
  gray: {
    100: '#EFF4F3',
    200: '#DFE8E9',
    300: '#B1BCBD',
    400: '#727B7C',
    500: '#222526',
    600: '#181E20',
    700: '#11171B',
    800: '#0A1016',
    900: '#060B12',
  },
  custom: {
    background: CustomColor.background,
    card: CustomColor.card,
    border: CustomColor.border,
  },
};
