import {TEXT_LT, TEXT_EN} from './TEXT.json';

export function getTextBasedOnLocale(locale) {
  return locale === 'lt_LT' ? TEXT_LT : TEXT_EN;
}
