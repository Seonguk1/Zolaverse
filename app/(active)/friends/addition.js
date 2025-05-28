import { SIZE, palette } from '@/constants/theme';
import useSearchUsers from '@/hooks/useFriend/useSearchUsers';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, SafeAreaView, Text, TextInput, View } from "react-native";
import { createRStyle } from "react-native-full-responsive";

export default function FriendsAddition() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [result, setResult] = useState([]);
    const { handleSearchUsers } = useSearchUsers();

    useEffect(() => {
        const delay = setTimeout(() => {
            const func = async () => {
                if (!search.trim()) {
                    setResult([]);
                    return;
                }
                const users = await handleSearchUsers(search);
                setResult(users);
                console.log('검색된 유저:', users.map(u => u.nickname));
            };

            func();
        }, 100);

        return () => clearTimeout(delay);
    }, [search]);


    return (
        <SafeAreaView style={styles.container}>
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
                    console.log(`item:${item.nickname}`)
                    return (
                        <View style={[styles.listItem, {flexDirection:"row", justifyContent:"space-between"}]}>
                            <Text>{item.nickname}</Text>
                            
                            <Pressable
                                style={styles.addBtn}
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
        alignItems:"center",
        padding: 10,
        marginBottom: 20
    },
    addBtn:{
        width: `${SIZE *2 }rs`,
        height: `${SIZE * 1.3}rs`,
        backgroundColor: palette[1],
        alignItems:"center",
        justifyContent:"center"
    }
})