import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Animated,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Text,
} from 'react-native';
import Block from './src/Components/Block';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const App = () => {
  //usestates
  const [puzzleSize, setPuzzleSize] = useState(16);
  const CELL_WIDTH = DEVICE_WIDTH / Math.sqrt(puzzleSize);
  const [grid, setGrid] = useState([]);
  const [zeroPos, setZeroPos] = useState(null);
  const [animation, setAnimation] = useState([]);

  //useeffects
  useEffect(() => {
    console.log('starting');
    initGrid();
    initAnimation();
  }, [puzzleSize]);

  //helpers
  const getZeroCoordinate = grid => {
    let pos = [-1, -1];

    for (let i = 0; i < Math.sqrt(puzzleSize); ++i) {
      for (let j = 0; j < Math.sqrt(puzzleSize); ++j) {
        if (grid[i][j] === 0) {
          pos = [i, j];
          break;
        }
      }
    }
    setZeroPos(pos);
  };

  const initAnimation = () => {
    let animations = [];

    for (let i = 0; i <= puzzleSize; ++i) {
      animations.push({
        x: new Animated.Value(0),
        y: new Animated.Value(0),
      });
    }
    setAnimation(animations);
  };

  const initGrid = () => {
    let grid = [];

    let n = Array.from({length: puzzleSize}, (v, i) => i);
    n.sort(() => Math.random() - 0.5);

    for (let i = 0, idx = 0; i < Math.sqrt(puzzleSize); ++i) {
      grid[i] = [];
      for (let j = 0; j < Math.sqrt(puzzleSize); ++j) {
        grid[i][j] = n[idx++];
      }
    }
    setGrid(grid);
    getZeroCoordinate(grid);
  };

  //functions
  const getXY = (gridIndex, blockIndex) => {
    let x = zeroPos[1];
    let y = zeroPos[0];

    if (x > -1 && y > -1) {
      let dx = Math.abs(x - blockIndex);
      let dy = Math.abs(y - gridIndex);

      if ((dx === 1 && dy === 0) || (dy === 1 && dx === 0)) {
        let tmp = grid[gridIndex][blockIndex];
        grid[gridIndex][blockIndex] = 0;
        grid[y][x] = tmp;

        setGrid([...grid]);
        setZeroPos([gridIndex, blockIndex]);

        let rx = 0;
        let ry = 0;

        if (dx) {
          rx = x - blockIndex < 0 ? 1 : -1;
        } else {
          ry = y - gridIndex < 0 ? 1 : -1;
        }
        return [rx, ry];
      }
    }
    return null;
  };

  const onPressMove = (blockValue, gridIndex, blockIndex) => {
    let xy = getXY(gridIndex, blockIndex);

    if (xy) {
      let d = xy[0] ? xy[0] : xy[1];
      let c = xy[0] ? 'x' : 'y';

      let currAnimation = [...animation];
      currAnimation[blockValue][c].setValue(CELL_WIDTH * d);

      setAnimation(currAnimation);

      Animated.timing(animation[blockValue][c], {
        toValue: 0,
        timing: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const onPressChangeSize = type => {
    const size = Math.sqrt(puzzleSize);
    let useSize;
    switch (type) {
      case 0:
        useSize = (size + 1) * (size + 1);
        if (useSize > 64) {
          alert('Warning: More tiles may cause performance issues');
        }
        setPuzzleSize(useSize);

        break;
      case 1:
        useSize = (size - 1) * (size - 1);
        if (useSize >= 9) {
          setPuzzleSize(useSize);
        } else {
          console.log('Cant go lower');
        }
        break;
      default:
        break;
    }
  };

  const RenderPuzzleBoard = () => {
    return grid.map((rowArray, gridIndex) => (
      <View style={styles.v1} key={gridIndex}>
        {rowArray.map((blockValue, blockIndex) => {
          return (
            <Block
              type={blockValue ? 0 : 1}
              blockValue={blockValue}
              blockIndex={blockIndex}
              gridIndex={gridIndex}
              animation={animation}
              onPressMove={onPressMove}
              key={blockIndex}
            />
          );
        })}
      </View>
    ));
  };

  return (
    <ImageBackground
      source={require('./src/Assets/Images/background.jpeg')}
      style={styles.IBG1}>
      <SafeAreaView style={styles.sv}>
        {/* <View style={[{padding: 20}]}> */}
        <View style={styles.v2}>
          <TouchableOpacity
            onPress={() => onPressChangeSize(1)}
            style={styles.b1}>
            <Text>-</Text>
          </TouchableOpacity>
          <Text>{puzzleSize}</Text>
          <TouchableOpacity
            style={styles.b1}
            onPress={() => onPressChangeSize(0)}>
            <Text>+</Text>
          </TouchableOpacity>
        </View>
        <RenderPuzzleBoard />
        {/* </View> */}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  IBG1: {
    width: DEVICE_WIDTH * 1,
    height: DEVICE_HEIGHT * 1,
  },
  v1: {
    flexDirection: 'row',
  },
  sv: {
    paddingTop: DEVICE_HEIGHT * 0.1,
  },
  v2: {
    flexDirection: 'row',
    width: DEVICE_WIDTH * 1,
    justifyContent: 'center',
    marginBottom: DEVICE_HEIGHT * 0.03,
    alignItems: 'center',
  },
  b1: {
    width: DEVICE_WIDTH * 0.07,
    height: DEVICE_WIDTH * 0.07,
    backgroundColor: '#FFF1A1',
    borderRadius: 25,
    marginHorizontal: DEVICE_WIDTH * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
