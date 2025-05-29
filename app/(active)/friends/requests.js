import LoadingOverlay from '@/components/loading/LoadingOverlay';
import LoadingView from '@/components/loading/LoadingView';
import { SIZE, palette } from '@/constants/theme';
import useGetFriendRequests from '@/hooks/useFriend/useGetFriendRequests';
import useUpdateFriendRequest from '@/hooks/useFriend/useUpdateFriendRequest';
import useGetUserDoc from '@/hooks/useUser/useGetUserDoc';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { Button, FlatList, Pressable, SafeAreaView, Text, View } from "react-native";
import { createRStyle } from 'react-native-full-responsive';

export default function FriendsList() {
    const router = useRouter();
    const { user, userDoc, userLoading } = useGetUserDoc();
    const { handleGetFriendRequests, getRequestLoading } = useGetFriendRequests();
    const { acceptFriendRequest, updateRequestLoading } = useUpdateFriendRequest();
    const [requests, setRequests] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (!user || !isFocused)
            return;

        const initial = async () => {
            const snapshot = await handleGetFriendRequests(userDoc.nickname);
            console.log(`requests:${snapshot}`)
            setRequests(snapshot);

        }
        initial();
    }, [user, isFocused])

    if (userLoading || getRequestLoading) {
        return <LoadingView />
    }

    const handlePress = async (item) => {
        try {
            await acceptFriendRequest(
                item.id,
                item.fromId,
                item.toId,
                item.fromNickname,
                item.toNickname
            );
            Alert.alert("친구 수락", "요청을 수락했습니다!");
        } catch (err) {
            Alert.alert("오류", "친구 수락 중 문제가 발생했습니다.");
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            {updateRequestLoading && <LoadingOverlay />}
            <Button
                title='친구 추가'
                onPress={() => {
                    router.push('friends/addition');
                }}
            />
            <FlatList
                data={requests}
                renderItem={({ item }) => {
                    return (
                        <View style={[styles.listItem, { flexDirection: "row", justifyContent: "space-between" }]}>
                            <Text>{item.fromNickname}</Text>

                            <Pressable
                                style={styles.addBtn}
                                onPress={() => {
                                    handlePress(item);
                                }}
                            >
                                <Text>수락</Text>
                            </Pressable>
                        </View>
                    )
                }}
            />
        </SafeAreaView>
    )
}

const styles = createRStyle({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    listItem: {
        width: `${SIZE * 10}rs`,
        height: `${SIZE * 1.7}rs`,
        backgroundColor: palette[0],
        alignItems: "center",
        padding: 10,
        marginBottom: 20
    },
    addBtn: {
        width: `${SIZE * 2}rs`,
        height: `${SIZE * 1.3}rs`,
        backgroundColor: palette[1],
        alignItems: "center",
        justifyContent: "center"
    }
})