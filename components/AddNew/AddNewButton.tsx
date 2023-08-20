import {useContext, useState} from 'react';
import {StyleSheet, Pressable} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import AppContext from '../../contexts/AppContext';

import AddNewModal from './AddNewModal';

import {Colors} from '../../types/colors';

export default function AddNewButton() {
  const {colors} = useContext(AppContext);
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Pressable
        style={styles(colors).middleButton}
        onPress={() => setVisible(true)}>
        <Icon name="plus" color={colors.White} size={30} />
      </Pressable>
      <AddNewModal
        key={'modal'}
        visible={visible}
        changeVisibility={setVisible}
      />
    </>
  );
}

const styles = (colors: Colors) =>
  StyleSheet.create({
    middleButton: {
      height: 50,
      width: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 100,
      backgroundColor: colors.Primary,
      elevation: 5,
      position: 'absolute',
      bottom: 25,
      right: 25,
      zIndex: 10,
    },
  });
