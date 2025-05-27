import { useEffect, useRef, useState } from "react";
import { Button, Pressable, SafeAreaView, Text, View } from "react-native";
import SpriteSheet from 'rn-sprite-sheet';

import LoadingView from "@/components/loading/LoadingView";
import useGetUserDoc from "@/hooks/useUser/useGetUserDoc";

import { createRStyle } from "react-native-full-responsive";
// import { SIZE, palette } from '@/constants/theme';

import { getCurrentState } from "@/utils/timeUtils";

export default function Home() {
  const zola = useRef(null);
  const [isPressed, setIsPressed] = useState(false);
  const { user, userDoc, userLoading } = useGetUserDoc();

  const [imgSource, setImgSource] = useState(require('@/assets/images/mashmell/Merged_image.png'));

  const play = (type, loop, onFinish = () => { }) => {
    zola.current?.play({
      type,
      fps: Number(5),
      loop,
      resetAfterFinish: false,
      onFinish,
    })
  }

  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!userDoc) return;

    const initial = getCurrentState(
      userDoc.sleepStart,
      userDoc.sleepEnd,
      userDoc.workStart,
      userDoc.workEnd
    );
    setStatus(initial);
    console.log(`initial status : ${initial}`);

    const zolaInterval = setInterval(() => {
      if (zola.current) {
        play(initial, true);
        clearInterval(zolaInterval);
      }
    }, 100);

    const interval = setInterval(() => {
      const updated = getCurrentState(
        userDoc.sleepStart,
        userDoc.sleepEnd,
        userDoc.workStart,
        userDoc.workEnd
      );
      setStatus(updated);
      console.log(`updated status : ${updated}`);
      play(updated, true);
    }, 60000);

    return () => {
      clearInterval(zolaInterval);
      clearInterval(interval);
    };
  }, [
    userDoc?.sleepStart,
    userDoc?.sleepEnd,
    userDoc?.workStart,
    userDoc?.workEnd
  ]);

  if (userLoading) {
    return <LoadingView />
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>

      </View>
      <View style={styles.main}>
        {isPressed && <Text>남은건 죽음 뿐이다...</Text>}
        <Pressable
          onPress={() => {
            setIsPressed(true);
            play('die', false,
              () => {
                setIsPressed(false);
                console.log("끝")
                play('sleep', true);
              }
            )
          }}

        >
          <SpriteSheet
            ref={ref => (zola.current = ref)}
            source={imgSource}
            columns={5}
            rows={3}
            height={480 * 0.5}
            width={600 * 0.5}
            imageStyle={{ marginTop: -1 }}
            animations={{
              sleep: [0, 1, 2, 3, 4],
              work: [5, 6, 7, 8, 9, 10]
              // sleep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
              // appear: Array.from({ length: 15 }, (v, i) => i + 18),
              // die: Array.from({ length: 21 }, (v, i) => i + 33),
            }}
          />
        </Pressable>

        <Button
          title="asd"
          onPress={() => {
          }}
        />

      </View>
    </SafeAreaView>
  )
}

const styles = createRStyle({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flex: 1,
  },
  main: {
    flex: 10,
    alignItems: "center",
    justifyContent: "center",
  },
})