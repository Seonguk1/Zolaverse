import LoadingOverlay from "@/components/loading/LoadingOverlay";
import LoadingView from "@/components/loading/LoadingView";
import useGetUserDoc from "@/hooks/useUser/useGetUserDoc";
import useUpdateUserDoc from "@/hooks/useUser/useUpdateUserDoc";
import { Button, SafeAreaView, StyleSheet } from "react-native";
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

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#fff",
    }
})