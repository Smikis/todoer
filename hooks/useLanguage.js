import { NativeModules } from 'react-native'

export function useLanguage() {
  const locale = NativeModules.I18nManager.localeIdentifier
  return { locale }
}
