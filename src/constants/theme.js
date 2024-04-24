import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const COLORS = {
  // base colors

  primary: '#3e8375',

  secondary: '#3a9784',

  searchBar: '#d68346',

  third: '#3781b0',
  askTeacherGadge: '#9ed4f5',
  gray: '#6A6A6A',

  lightGray: '#F5F5F6',
  lightGray2: '#F6F6F7',
  lightGray3: '#EFEFF1',
  lightGray4: '#F8F8F9',
  transparent: 'transparent',
  darkgray: '#898C95',
  orange: '#FFA133',
  lightOrange: '#b0ab4f',
  lightOrange2: '#FDDED4',
  lightOrange3: '#FFD9AD',
  green: '#27AE60',
  red: '#FF1717',
  red2: '#FF6C44',
  blue: '#0064C0',
  darkBlue: '#111A2C',
  darkGray: '#525C67',
  darkGray2: '#757D85',
  gray: '#898B9A',
  gray2: '#BBBDC1',
  gray3: '#CFD0D7',
  lightGray1: '#DDDDDD',
  lightGray2: '#F5F5F8',
  white2: '#FBFBFB',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  transparentWhite1: 'rgba(255, 255, 255, 0.1)',
  transparentBlack1: 'rgba(0, 0, 0, 0.1)',
  transparentBlack7: 'rgba(0, 0, 0, 0.7)',
  transparentGreen: 'rgba(0,225,0,0.2)',
  transparentRed: 'rgba(255,0,0,0.2)',
};

export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 30,
  padding: 10,
  padding2: 12,

  // font sizes
  largeTitle: 50,
  h1: 30,
  h2: 22,
  h3: 20,
  h4: 18,
  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,
  body5: 12,

  // app dimensions
  width,
  height,
};

export const FONTS = {
  h1: { fontFamily: 'Janna LT Bold', fontSize: SIZES.h1, lineHeight: 36 },
  body3: { fontFamily: 'Janna LT Bold', fontSize: SIZES.body3, lineHeight: 22 },

  fontFamily: 'Janna LT Bold',
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
