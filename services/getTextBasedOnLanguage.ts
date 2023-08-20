import {TEXT_LT, TEXT_EN} from '../constants/TEXT';

export function getTextBasedOnLocale(locale: string) {
  return locale === 'lt_LT' ? TEXT_LT : TEXT_EN;
}
