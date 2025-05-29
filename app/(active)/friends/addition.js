import LoadingOverlay from '@/components/loading/LoadingOverlay';
import LoadingView from '@/components/loading/LoadingView';
import { SIZE, palette } from '@/constants/theme';
import useCreateFriendRequest from '@/hooks/useFriend/useCreateFriendRequest';
import useSearchUsers from '@/hooks/useFriend/useSearchUsers';
import useGetUserDoc from '@/hooks/useUser/useGetUserDoc';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, SafeAreaView, Text, TextInput, View } from "react-native";
import { createRStyle } from "react-native-full-responsive";

export default function FriendsAddition() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [result, setResult] = useState([]);
    const { handleSearchUsers } = useSearchUsers();
    const { handleCreateFriendRequest, requestLoading } = useCreateFriendRequest();
    const { user, userDoc, userLoading } = useGetUserDoc();

    useEffect(() => {
        const delay = setTimeout(() => {
            const func = async () => {
                if (!search.trim()) {
                    setResult([]);
                    return;
                }
                const users = await handleSearchUsers(search);
                setResult(users);
            };

            func();
        }, 100);

        return () => clearTimeout(delay);
    }, [search]);

    if(userLoading){
        return <LoadingView/>
    }

    const handlePress = async (item) => {
        await handleCreateFriendRequest(user.uid, item.id, userDoc.nickname, item.nickname);
        Alert.alert("친구 요청", "요청을 보냈습니다!");
        router.replace('/friends/requests');
    }

    return (
        <SafeAreaView style={styles.container}>
            {requestLoading && <LoadingOverlay/>}
            <TextInput
                style={styles.input}
                value={search}
                onChangeText={setSearch}
                placeholder="search for name"
                placeholderTextColor={"gray"}
                selectionColor="gray"
            />
            <FlatList
                data={result}
                renderItem={({ item }) => {
                    return (
                        <View style={[styles.listItem, { flexDirection: "row", justifyContent: "space-between" }]}>
                            <Text>{item.nickname}</Text>

                            <Pressable
                                style={styles.addBtn}
                                onPress={()=>{
                                    handlePress(item);
                                }}
                            >
                                <Text>요청</Text>
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
    input: {
        width: `${SIZE * 10}rs`,
        height: `${SIZE * 1.7}rs`,
        backgroundColor: palette[0],
        padding: 10,
        marginBottom: 200
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