import {Text, View} from 'react-native';

export const toastConfig = {
  successToast: ({text1, text2, props}: any) => (
    <View
      style={{
        paddingHorizontal: 15,
        height: 60,
        width: '80%',
        backgroundColor:
          props.theme === 'Dark' ? props.colors.DarkGrey : props.colors.White,
        borderLeftColor: props.colors.Primary,
        borderLeftWidth: 5,
        elevation: 10,
        borderRadius: 3,
      }}>
      <Text
        style={{
          fontSize: 17,
          paddingVertical: 5,
          fontWeight: '500',
          color:
            props.theme === 'Dark' ? props.colors.White : props.colors.Black,
        }}>
        {text1}
      </Text>
      <Text
        style={{
          color:
            props.theme === 'Dark' ? props.colors.White : props.colors.Black,
          fontSize: 14,
          fontWeight: '400',
        }}>
        {text2}
      </Text>
    </View>
  ),
  errorToast: ({text1, text2, props}: any) => (
    <View
      style={{
        paddingHorizontal: 15,
        height: 60,
        width: '80%',
        backgroundColor:
          props.theme === 'Dark' ? props.colors.DarkGrey : props.colors.White,
        borderLeftColor: props.colors.Red,
        borderLeftWidth: 5,
        elevation: 10,
        borderRadius: 3,
      }}>
      <Text
        style={{
          fontSize: 17,
          paddingVertical: 5,
          fontWeight: '500',
          color:
            props.theme === 'Dark' ? props.colors.White : props.colors.Black,
        }}>
        {text1}
      </Text>
      <Text
        style={{
          color:
            props.theme === 'Dark' ? props.colors.White : props.colors.Black,
          fontSize: 14,
          fontWeight: '400',
        }}>
        {text2}
      </Text>
    </View>
  ),
};
