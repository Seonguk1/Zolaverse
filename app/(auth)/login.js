import LoadingOverlay from "@/components/loading/LoadingOverlay";
import { auth } from "@/config/firebase";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRef, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { createRStyle } from "react-native-full-responsive";

const SIZE = 20;

const palette = [
    "#F9F7F7",
    "#DBE2EF",
    "#3F72AF",
    "#112D4E",
]

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [onFocus, setOnFocus] = useState('');
    const passwordRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.replace('/home');
        } catch (error) {
            console.error(error);
            Alert.alert('로그인 실패', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <SafeAreaView style={styles.container}>
                    {loading && <LoadingOverlay />}
                    <View style={styles.loginForm}>
                        <Text style={styles.title}>Login</Text>
                        <TextInput
                            style={[
                                styles.input,
                                onFocus === 'email' && styles.focusedInput,
                            ]}
                            placeholder="Email"
                            placeholderTextColor={"gray"}
                            selectionColor="gray"
                            enterKeyHint="next"
                            onSubmitEditing={() => passwordRef.current?.focus()}
                            inputMode="email"
                            onFocus={() => setOnFocus("email")}
                            onBlur={() => setOnFocus(null)}
                            onChangeText={setEmail}
                            value={email}
                        />
                        <TextInput
                            ref={passwordRef}
                            style={[
                                styles.input,
                                onFocus === 'password' && styles.focusedInput,
                            ]}
                            placeholder="Password"
                            placeholderTextColor={"gray"}
                            secureTextEntry
                            onFocus={() => { setOnFocus("password") }}
                            onBlur={() => setOnFocus(null)}
                            onChangeText={setPassword}
                            value={password}
                        />
                        <View style={{ flexDirection: "row" }}>
                            <Pressable
                                style={styles.loginSubmit}
                                onPress={handleLogin}
                            >
                                <Text style={styles.loginText}> Login </Text>
                            </Pressable>
                            <Pressable
                                style={styles.signUpSubmit}
                                onPress={() => {
                                    router.push('sign-up');
                                }}
                            >
                                <Text style={styles.signUpText}> Sign up </Text>
                            </Pressable>
                        </View>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

const styles = createRStyle({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
    },
    input: {
        width: `${SIZE * 10}rs`,
        height: `${SIZE * 1.7}rs`,
        backgroundColor: palette[0],
        padding: 10,
        marginBottom: 20
    },
    focusedInput: {
        borderColor: palette[1],
        borderWidth: 1
    },
    title: {
        color: palette[2],
        fontSize: `${SIZE * 2}rs`,
        fontWeight: "bold",
        marginBottom: 20,
    },
    loginText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: `${SIZE * 0.7}rs`,
    },
    signUpText: {
        color: palette[3],
    },
    loginSubmit: {
        backgroundColor: palette[2],
        width: `${SIZE * 2.7}rs`,
        height: `${SIZE * 1.5}rs`,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10
    },
    signUpSubmit: {
        backgroundColor: "#fff",
        width: `${SIZE * 2.7}rs`,
        height: `${SIZE * 1.5}rs`,
        alignItems: "center",
        justifyContent: "center"
    },

})