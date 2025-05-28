import { useRouter } from "expo-router";
import { Button, SafeAreaView } from "react-native";

export default function FriendsList (){
    const router = useRouter();

    return(
        <SafeAreaView>
            <Button
                title='친구 추가'
                onPress={()=>{
                    router.push('friends/add');
                }}
            />
        </SafeAreaView>
    )
}