import {useContext, useEffect} from 'react';
import {Pressable} from 'react-native';

import SideBarContext from '../contexts/SideBarContext';

import Icon from 'react-native-vector-icons/FontAwesome';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import AppContext from '../contexts/AppContext';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export default function MenuIcon() {
  const {sideBarOpen, setSideBarOpen} = useContext(SideBarContext);
  const {colors, theme} = useContext(AppContext);

  const menuIconRotation = useSharedValue(0);
  const menuIconOpacity = useSharedValue(1);

  const closeIconRotation = useSharedValue(0);
  const closeIconOpacity = useSharedValue(0);

  useEffect(() => {
    if (sideBarOpen) {
      menuIconRotation.value = withTiming(90, {duration: 500});
      menuIconOpacity.value = withTiming(0, {duration: 500});

      closeIconRotation.value = withTiming(0, {duration: 500});
      closeIconOpacity.value = withTiming(1, {duration: 500});
    } else {
      menuIconRotation.value = withTiming(0, {duration: 500});
      menuIconOpacity.value = withTiming(1, {duration: 500});

      closeIconRotation.value = withTiming(90, {duration: 500});
      closeIconOpacity.value = withTiming(0, {duration: 500});
    }
  }, [sideBarOpen]);

  const menuIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotate: `${menuIconRotation.value}deg`}],
      opacity: menuIconOpacity.value,
    };
  });

  const closeIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotate: `${closeIconRotation.value}deg`}],
      opacity: closeIconOpacity.value,
    };
  });

  return (
    <Pressable
      onPress={() => {
        setSideBarOpen(prev => !prev);
      }}
      style={{
        width: 40,
        height: 40,
        borderRadius: 100,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <AnimatedIcon
        style={[menuIconStyle, {position: 'absolute'}]}
        color={theme === 'Dark' ? colors.White : colors.Black}
        name={'navicon'}
        size={30}
      />
      <AnimatedIcon
        style={[closeIconStyle, {position: 'absolute'}]}
        color={theme === 'Dark' ? colors.White : colors.Black}
        name={'close'}
        size={30}
      />
    </Pressable>
  );
}
