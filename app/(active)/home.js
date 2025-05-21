import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function SpriteCharacter() {
  const frameWidth = 64;
  const totalFrames = 6;
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % totalFrames);
    }, 200); // 100ms마다 프레임 전환

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.frame}>
      <Image
        source={require('@/assets/images/run.png')}
        style={{
          width: frameWidth * totalFrames,
          height: 640,
          transform: [{ translateX: -frameIndex * frameWidth }],
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: 64,
    height: 640,
    overflow: 'hidden',
  },
});
