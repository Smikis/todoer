import {Light, Dark} from './COLORS.json';

export function getColorsByTheme(theme) {
  return theme === 'Light' ? Light : Dark;
}
