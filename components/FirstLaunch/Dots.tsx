import {View} from 'react-native';

import Dot from './Dot';

interface DotsProps {
  steps: {
    id: number;
    text: string;
    title: string;
    image: string;
  }[];
  step: number;
}

export default function Dots({steps, step}: DotsProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {steps.map((item, index) => (
        <Dot key={index} step={step} index={index} />
      ))}
    </View>
  );
}
