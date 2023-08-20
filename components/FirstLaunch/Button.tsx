import {useContext, useEffect} from 'react';
import {Pressable} from 'react-native';

import AppContext from '../../contexts/AppContext';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps {
  onClick: () => void;
  shown: boolean;
  buttonContent: React.ReactNode;
  left?: boolean;
  style?: any;
}

export default function Button({
  onClick,
  shown,
  buttonContent,
  left,
  style,
}: ButtonProps) {
  const {colors} = useContext(AppContext);

  const buttonOpacity = useSharedValue(1);
  const buttonTranslateX = useSharedValue(left ? -100 : 100);

  const animButton = useAnimatedStyle(() => {
    return {
      opacity: buttonOpacity.value,
      transform: [{translateX: buttonTranslateX.value}],
    };
  });

  useEffect(() => {
    if (shown) {
      buttonOpacity.value = withSpring(1);
      buttonTranslateX.value = withSpring(0);
    } else {
      buttonOpacity.value = withTiming(0, {duration: 300});
      buttonTranslateX.value = withTiming(left ? -100 : 100, {duration: 300});
    }
  }, [shown]);

  return (
    <AnimatedPressable
      onPress={onClick}
      style={[
        {
          backgroundColor: colors.White,
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 100,
          justifyContent: 'center',
          alignItems: 'center',
          ...style,
        },
        animButton,
      ]}>
      {buttonContent}
    </AnimatedPressable>
  );
}
