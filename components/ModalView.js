import { Modal } from 'react-native'
import React, { useContext } from 'react'
import { BlurView } from '@react-native-community/blur'

import AppContext from '../contexts/AppContext'

import PropTypes from 'prop-types'

export default function ModalView({ visible, handleExit, children }) {
  const { theme } = useContext(AppContext)

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleExit}
      statusBarTranslucent={true}>
      <BlurView
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0
        }}
        blurType={theme === 'Dark' ? 'dark' : 'light'}
        blurAmount={1}
        onTouchEnd={handleExit}
      />
      {children}
    </Modal>
  )
}

ModalView.propTypes = {
  visible: PropTypes.bool,
  handleExit: PropTypes.func,
  children: PropTypes.node
}
