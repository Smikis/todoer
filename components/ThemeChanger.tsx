import {useContext} from 'react';
import {Pressable} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import Icon from 'react-native-vector-icons/FontAwesome';
import AppContext from '../contexts/AppContext';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export default function ThemeChanger() {
  const {theme, switchTheme, colors} = useContext(AppContext);

  const sunIconTranslateX = useSharedValue(theme === 'Dark' ? 50 : 0);
  const sunIconOpacity = useSharedValue(theme === 'Dark' ? 0 : 1);
  const moonIconTranslateX = useSharedValue(theme === 'Dark' ? 0 : 50);
  const moonIconOpacity = useSharedValue(theme === 'Dark' ? 1 : 0);

  const sunIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: sunIconTranslateX.value}],
      opacity: sunIconOpacity.value,
    };
  });
  const moonIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: moonIconTranslateX.value}],
      opacity: moonIconOpacity.value,
    };
  });

  return (
    <Pressable
      style={{
        padding: 5,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: 40,
        marginLeft: 15,
      }}
      onPress={() => {
        switchTheme();
        sunIconTranslateX.value = withTiming(theme === 'Dark' ? 0 : 50, {
          duration: 500,
        });
        sunIconOpacity.value = withTiming(theme === 'Dark' ? 1 : 0, {
          duration: 500,
        });
        moonIconTranslateX.value = withTiming(theme === 'Dark' ? 50 : 0, {
          duration: 500,
        });
        moonIconOpacity.value = withTiming(theme === 'Dark' ? 0 : 1, {
          duration: 500,
        });
      }}>
      <AnimatedIcon
        style={[sunIconStyle, {position: 'absolute'}]}
        name={'sun-o'}
        color={theme === 'Dark' ? colors.White : colors.Black}
        size={30}
      />
      <AnimatedIcon
        style={[moonIconStyle, {position: 'absolute'}]}
        name={'moon-o'}
        color={theme === 'Dark' ? colors.White : colors.Black}
        size={30}
      />
    </Pressable>
  );
}
