import { auth } from '@/config/firebase';
import { useEffect, useRef, useState } from "react";
import { Button, Pressable, SafeAreaView, Text, View } from "react-native";
import SpriteSheet from 'rn-sprite-sheet';

import LoadingView from "@/components/loading/LoadingView";
import useGetUserDoc from "@/hooks/useUser/useGetUserDoc";

import { createRStyle } from "react-native-full-responsive";
// import { SIZE, palette } from '@/constants/theme';

import { getCurrentState } from "@/utils/timeUtils";
import { onAuthStateChanged, signOut } from 'firebase/auth';

// 해야할 것
// workEnd 00:00 , workStart 23:59 되는지?
// 시각이 겹쳤을 때 어떻게 되는지, 어떻게 할 지?

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      const waitForLogout = () => new Promise(resolve => {
        const unsub = onAuthStateChanged(auth, (user) => {
          if (!user) {
            resolve();
            unsub();
          }
        });
      });

      await waitForLogout();
      console.log("로그아웃 성공");
      console.log(user.uid);

    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>

      </View>
      <View style={styles.main}>
        {isPressed && <Text>남은건 죽음 뿐이다...</Text>}
        <Pressable
          onPress={() => {
            setIsPressed(true);
            play('rest', false,
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
            rows={6}
            height={480 * 0.5}
            width={600 * 0.5}
            imageStyle={{ marginTop: -1 }}
            animations={{
              rest: Array.from({ length: 14 }, (v, i) => i),
              sleep: Array.from({ length: 5 }, (v, i) => i + 15),
              work: Array.from({ length: 6 }, (v, i) => i + 20),
            }}
          />
        </Pressable>

        <Button
          title="로그아웃"
          onPress={handleLogout}
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