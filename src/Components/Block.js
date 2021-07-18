import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';

const Block = props => {
  const {type, blockValue, blockIndex, gridIndex, animation, onPressMove} =
    props;

  switch (type) {
    case 0:
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            onPressMove(blockValue, gridIndex, blockIndex);
          }}>
          <Animated.View
            style={[
              {
                transform: [
                  {translateX: animation[blockValue].x},
                  {translateY: animation[blockValue].y},
                ],
              },
              styles.block,
            ]}>
            <Text style={styles.blockText}>{blockValue}</Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      );

    case 1:
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            onPressMove(blockValue, gridIndex, blockIndex);
          }}>
          <Animated.View
            style={[
              {
                transform: [
                  {translateX: animation[blockValue].x},
                  {translateY: animation[blockValue].y},
                ],
              },
              styles.emptyBlock,
            ]}>
            <Text style={styles.emptyBlockText}>{blockValue}</Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      );

    default:
      break;
  }
};

const styles = StyleSheet.create({
  block: {
    flex: 3,
    backgroundColor: '#FFF1A1',
    aspectRatio: 1,
    margin: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    borderRadius: 25,
    elevation: 4,
  },
  blockText: {
    color: '#000',
  },
  emptyBlock: {
    flex: 3,
    aspectRatio: 1,
    margin: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -999,
    elevation: -999,
  },
  emptyBlockText: {
    color: '#fff',
  },
});

export default Block;
