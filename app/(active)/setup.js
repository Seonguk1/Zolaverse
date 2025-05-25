import LoadingOverlay from "@/components/loading/LoadingOverlay";
import LoadingView from "@/components/loading/LoadingView";
import useGetUserDoc from "@/hooks/useUser/useGetUserDoc";
import useUpdateUserDoc from "@/hooks/useUser/useUpdateUserDoc";
import { Button, SafeAreaView } from "react-native";
import { createRStyle } from "react-native-full-responsive";
// import { SIZE, palette } from '@/constants/theme';
export default function Setup (){
    const {user, userDoc, userLoading} = useGetUserDoc();
    const {updateUserDoc, updateLoading} = useUpdateUserDoc();
    
    if(userLoading){
        return <LoadingView/>
    }

    return(
        <SafeAreaView style={styles.container}>
            {updateLoading && <LoadingOverlay/>}
            <Button
                title="속성 추가"
                onPress={()=>{
                    updateUserDoc({sleep:'12'});
                }}
            />
        </SafeAreaView>
    )
}

const styles = createRStyle({
    container:{
        flex:1,
        backgroundColor: "#fff",
    }
})