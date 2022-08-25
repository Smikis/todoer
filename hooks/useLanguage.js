import { NativeModules } from 'react-native'

export default function useLanguage() {
  const locale = NativeModules.I18nManager.localeIdentifier
  return {
    locale
  }
}
