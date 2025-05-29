import LoadingView from '@/components/loading/LoadingView';
import { SIZE, palette } from '@/constants/theme';
import useGetUserDoc from '@/hooks/useUser/useGetUserDoc';
import { useRouter } from "expo-router";
import { FlatList, SafeAreaView, Text, View } from "react-native";
import { createRStyle } from 'react-native-full-responsive';

export default function FriendsList() {
    const router = useRouter();
    const { user, userDoc, userFriends, userLoading } = useGetUserDoc();

    if (userLoading ) {
        return <LoadingView />
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={userFriends}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    return (
                        <View style={[styles.listItem, { flexDirection: "row", justifyContent: "space-between" }]}>
                            <Text>{item.nickname}</Text>
                            
                        </View>
                    )
                }}
                ListEmptyComponent={<Text style={{ marginTop: 20 }}>친구가 없습니다.</Text>}
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