// import { useEffect, useRef, useState } from "react";
// import { Button, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
// import SpriteSheet from 'rn-sprite-sheet';

// import { db } from "@/config/firebase";
// import { addDoc, collection, getDocs } from "firebase/firestore";

// export default function Home() {
//   const zola = useRef(null);
//   const [isPressed, setIsPressed] = useState(false);

//   useEffect(() => {
//     play('walk', true);
//   }, [])

//   const play = (type, loop, onFinish = () => { }) => {
//     zola.current?.play({
//       type,
//       fps: Number(16),
//       loop,
//       resetAfterFinish: false,
//       onFinish,
//     })
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>

//       </View>
//       <View style={styles.main}>
//         {isPressed && <Text>남은건 죽음 뿐이다...</Text>}
//         <Pressable
//           onPress={() => {
//             setIsPressed(true);
//             play('die', false,
//               () => {
//                 setIsPressed(false);
//                 console.log("끝")
//                 play('walk', true);
//               }
//             )
//           }}

//         >
//           <SpriteSheet
//             ref={ref => (zola.current = ref)}
//             source={require('@/assets/images/mummy.png')}
//             columns={9}
//             rows={6}
//             imageStyle={{ marginTop: -1 }}
//             animations={{
//               walk: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
//               appear: Array.from({ length: 15 }, (v, i) => i + 18),
//               die: Array.from({ length: 21 }, (v, i) => i + 33),
//             }}
//           />
//         </Pressable>
//         <Button
//           title="addDoc"
//           onPress={async () => {
//             try {
//               const docRef = await addDoc(collection(db, "users"), {
//                 first: "Ada",
//                 last: "Lovelace",
//                 born: 1815
//               });
//               console.log("Document written with ID: ", docRef.id);
//             } catch (e) {
//               console.error("Error adding document: ", e);
//             }
//           }}
//         />
//         <Button
//           title="getDocs" 
//           onPress={async () => {
//             const querySnapshot = await getDocs(collection(db, "users"));
//             querySnapshot.forEach((doc) => {
//               console.log(`${doc.id} => ${doc.data().first}`);
//             });
//           }}
//         />
//       </View>
//     </SafeAreaView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   header: {
//     flex: 1,
//   },
//   main: {
//     flex: 10,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// })