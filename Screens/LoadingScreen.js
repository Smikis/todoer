import React, {useContext} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import AppContext from '../contexts/AppContext';
import PropTypes from 'prop-types';

export default function LoadingScreen({visible}) {
  const {TEXT, colors} = useContext(AppContext);
  return (
    <View style={styles(colors).spinner}>
      <ActivityIndicator size="large" color="blue" animating={visible} />
      <Text style={styles(colors).loading_text}>{TEXT.Loading}</Text>
    </View>
  );
}

LoadingScreen.propTypes = {
  visible: PropTypes.bool,
};

const styles = colors =>
  StyleSheet.create({
    spinner: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.Background,
    },
    loading_text: {
      fontSize: 30,
      color: colors.Loading_Text,
    },
  });
