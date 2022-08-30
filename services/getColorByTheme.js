import { light, dark } from '../constants/COLORS'

export function getColorsByTheme(theme) {
  return theme === 'Light' ? light : dark
}
