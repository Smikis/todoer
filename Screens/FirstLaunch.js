import { View, Text, StatusBar, Dimensions, Image } from 'react-native'
import React, { useContext, useState } from 'react'
import AppContext from '../contexts/AppContext'
import Dots from '../components/FirstLaunch/Dots'
import Buttons from '../components/FirstLaunch/Buttons'
import Button from '../components/FirstLaunch/Button'
import { useNavigation } from '@react-navigation/native'
import { FlatList } from 'react-native-gesture-handler'
import Animated, { SlideInLeft, SlideOutLeft } from 'react-native-reanimated'

export default function FirstLaunch({ startStep = 0 }) {
  const { colors, locale, TEXT } = useContext(AppContext)
  const { width } = Dimensions.get('window')
  const navigation = useNavigation()

  const [step, setStep] = useState(startStep)
  const flatlistRef = React.useRef(null)

  const steps = [
    {
      id: 0,
      title:
        locale == 'lt_LT'
          ? 'Sveiki prisijungę į todoer!'
          : 'Welcome to todoer!',
      text:
        locale == 'lt_LT'
          ? 'todoer yra veiklų sekimo programėlė, padedanti Jums lengviau planuoti savo laiką.'
          : 'todoer is a simple to-do app that helps you keep track of your tasks.',
      image: require('../icons/wave.png')
    },
    {
      id: 1,
      title: locale == 'lt_LT' ? 'Likite prisijungę' : 'Stay connected',
      text:
        locale == 'lt_LT'
          ? 'Prisijunkite arba susikurkite naują paskyrą ir sekite savo veiklas kituose įrenginiuose arba tęskite su vietine paskyra.'
          : 'Log in or create an account to sync your tasks across devices or continue with a local account.',
      image: require('../icons/cloud.png')
    },
    {
      id: 2,
      title: locale == 'lt_LT' ? 'Viskas baigta!' : 'All done!',
      text:
        locale == 'lt_LT'
          ? 'Dabar galėsite pradėti sekti savo veiklas.'
          : 'You will now be able to start tracking your tasks.',
      image: require('../icons/ok.png')
    }
  ]

  return (
    <>
      <StatusBar
        backgroundColor={colors.Primary}
        barStyle={'light-content'}
        animated={true}
        showHideTransition={'slide'}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: colors.Primary,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <FlatList
          maxToRenderPerBatch={1}
          windowSize={2}
          ref={flatlistRef}
          data={steps}
          keyExtractor={(item, index) => index.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={true}
          snapToAlignment="center"
          decelerationRate={'normal'}
          initialScrollIndex={startStep}
          snapToInterval={width}
          style={{
            flex: 1,
            width: width
          }}
          scrollEventThrottle={16}
          onScroll={event => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width)
            setStep(index)
          }}
          renderItem={({ item }) => (
            <Animated.View
              entering={SlideInLeft.springify()}
              exiting={SlideOutLeft.springify()}
              style={{
                flex: 1,
                width: width,
                backgroundColor: colors.Primary,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 20
              }}>
              <Image
                source={item.image}
                style={{
                  width: 150,
                  height: 150,
                  marginBottom: 20
                }}
              />
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: 'bold',
                  color: colors.White
                }}>
                {item.title}
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'normal',
                  color: colors.White,
                  textAlign: 'center',
                  marginTop: 10
                }}>
                {item.text}
              </Text>
              {item.id === 1 && (
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    marginTop: 20
                  }}>
                  <Button
                    shown={item.id === 1}
                    onClick={() => {
                      navigation.navigate('Login')
                    }}
                    buttonContent={
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: 'bold',
                          color: colors.Primary
                        }}>
                        {TEXT.Login.Sign_In}
                      </Text>
                    }
                  />
                  <Button
                    shown={item.id === 1}
                    onClick={() => {
                      navigation.navigate('Register')
                    }}
                    buttonContent={
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: 'bold',
                          color: colors.Primary
                        }}>
                        {TEXT.Register.Sign_Up}
                      </Text>
                    }
                  />
                </View>
              )}
            </Animated.View>
          )}
        />
        <Dots steps={steps} step={step} />
        <Buttons
          step={step}
          steps={steps}
          flatlistRef={flatlistRef}
          setStep={setStep}
        />
      </View>
    </>
  )
}
