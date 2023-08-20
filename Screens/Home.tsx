import React, {useContext, useEffect} from 'react';
import {StyleSheet, Pressable, BackHandler} from 'react-native';

import AppContext from '../contexts/AppContext';
import SideBarContext from '../contexts/SideBarContext';

import {AppHeader, SideBar, HomeContent} from '../components';

import {AddNewButton} from '../components/AddNew';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useFocusEffect} from '@react-navigation/native';
import {Colors} from '../types/colors';
import {Theme} from '../types/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Home() {
  const {colors, theme} = useContext(AppContext);
  const {sideBarOpen, setSideBarOpen} = useContext(SideBarContext);

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const borderRadius = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}, {translateX: translateX.value}],
      borderRadius: borderRadius.value,
    };
  });

  useEffect(() => {
    if (sideBarOpen) {
      scale.value = withTiming(0.9, {duration: 500});
      translateX.value = withTiming(200, {duration: 500});
      borderRadius.value = withTiming(10, {duration: 500});
    } else {
      scale.value = withTiming(1, {duration: 500});
      translateX.value = withTiming(0, {duration: 500});
      borderRadius.value = withTiming(0, {duration: 500});
    }
  }, [sideBarOpen]);

  useFocusEffect(() => {
    const onBackPress = () => {
      if (sideBarOpen) {
        setSideBarOpen(false);
        return true;
      } else {
        return false;
      }
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  });

  return (
    <>
      <SideBar />
      <AnimatedPressable
        onPress={() => setSideBarOpen(false)}
        style={[styles(colors, theme).background, animStyle]}>
        <AppHeader />
        <HomeContent />
        <AddNewButton />
      </AnimatedPressable>
    </>
  );
}

const styles = (colors: Colors, theme: Theme) =>
  StyleSheet.create({
    background: {
      backgroundColor: theme === 'Dark' ? colors.DarkGrey : colors.White,
      flexGrow: 1,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      elevation: 10,
      overflow: 'hidden',
    },
  });
