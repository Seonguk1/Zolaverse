import checkNicknameExists from "@/api/checkNickname";
import LoadingOverlay from "@/components/loading/LoadingOverlay";
import { auth } from '@/config/firebase';
import useCreateUser from "@/hooks/useUser/useCreateUser";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from "react-native";

import { SIZE, palette } from '@/constants/theme';
import { createRStyle } from "react-native-full-responsive";

export default function SignUp() {
  const router = useRouter();
  const { handleCreateUser } = useCreateUser();

  const inputRefs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(null);

  const inputKeys = ['email', 'password', 'passwordConfirm', 'nickname'];
  const placeholders = ['이메일', '비밀번호', '비밀번호 확인', '닉네임'];

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
  });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/missing-email':
        return '이메일을 입력해주세요.';
      case 'auth/invalid-email':
        return '올바른 이메일 형식이 아닙니다.';
      case 'auth/email-already-in-use':
        return '이미 가입된 이메일입니다.';
      case 'auth/missing-password':
        return '비밀번호를 입력해주세요.';
      case 'auth/weak-password':
        return '비밀번호는 최소 8자 이상, 문자와 숫자를 포함하여야 합니다.';
      case 'nickname/missing':
        return '닉네임을 입력해주세요.';
      case 'nickname/duplicate':
        return '이미 존재하는 닉네임입니다.';
      default:
        return '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.';
    }
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);

      const { email, password, passwordConfirm, nickname } = formData;

      if (!email) throw Object.assign(new Error(), { code: 'auth/missing-email' });
      if (!password) throw Object.assign(new Error(), { code: 'auth/missing-password' });
      if (!nickname) throw Object.assign(new Error(), { code: 'nickname/missing' });
      if (password !== passwordConfirm) {
        Alert.alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      const isDuplicate = await checkNicknameExists(nickname);
      if (isDuplicate) throw Object.assign(new Error(), { code: 'nickname/duplicate' });

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await handleCreateUser({ id: user.uid, nickname });

      Alert.alert('회원가입 성공', `환영합니다, ${user.email}!`);
      router.push("register/completion");
    } catch (error) {
      const msg = getErrorMessage(error.code);
      setError(msg);
      console.log(msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <SafeAreaView style={styles.container}>
          {submitLoading && <LoadingOverlay />}
          <View style={styles.loginForm}>
            <Text style={styles.title}>Sign up</Text>
            {placeholders.map((placeholder, index) => {
              const key = inputKeys[index];
              const isPassword = key.includes('password');
              return (
                <TextInput
                  key={key}
                  ref={(el) => (inputRefs.current[index] = el)}
                  placeholder={placeholder}
                  placeholderTextColor="gray"
                  secureTextEntry={isPassword}
                  style={[
                    styles.input,
                    focusedIndex === index && styles.focusedInput,
                  ]}
                  returnKeyType={index < inputKeys.length - 1 ? 'next' : 'done'}
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(null)}
                  onSubmitEditing={() => {
                    if (index < inputKeys.length - 1) {
                      inputRefs.current[index + 1]?.focus();
                    }
                  }}
                  blurOnSubmit={false}
                  value={formData[key]}
                  onChangeText={(text) => handleChange(key, text)}
                />
              );
            })}
            <View style={{ flexDirection: "row" }}>
              <Pressable
                style={styles.loginSubmit}
                onPress={handleSubmit}
              >
                <Text style={styles.loginText}> Sign in </Text>
              </Pressable>
              <Pressable
                style={styles.back}
                onPress={() => { router.back() }}
              >
                <Text style={styles.backText}> back </Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
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
    width: `${SIZE * 3}rs`,
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
  loginForm: {
  },
  back: {
    alignItems:"center",
    justifyContent:"center"
  },
  backText: {
    color: palette[2],
    fontWeight: "bold",
    fontSize: `${SIZE * 0.7}rs`,
  }
});
