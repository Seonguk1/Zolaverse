import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Button, Platform, Text, View } from "react-native";

// import useGetUserDoc from "@/hooks/useUser/useGetUserDoc";
import useUpdateUserDoc from "@/hooks/useUser/useUpdateUserDoc";

export default function RoutineSetupScreen() {
    // const {user, userDoc, userLoading} = useGetUserDoc();
    const {updateUserDoc, updateLoading} = useUpdateUserDoc();
    const [sleepStart, setSleepStart] = useState(new Date());
    const [sleepEnd, setSleepEnd] = useState(new Date());
    const [workStart, setWorkStart] = useState(new Date());
    const [workEnd, setWorkEnd] = useState(new Date());

    const [showPicker, setShowPicker] = useState({ type: null, visible: false });

    const openPicker = (type) => setShowPicker({ type, visible: true });

    const handleChange = (event, selectedDate) => {
        if (Platform.OS === "android") setShowPicker({ ...showPicker, visible: false });

        if (selectedDate) {
            switch (showPicker.type) {
                case "sleepStart":
                    setSleepStart(selectedDate);
                    break;
                case "sleepEnd":
                    setSleepEnd(selectedDate);
                    break;
                case "workStart":
                    setWorkStart(selectedDate);
                    break;
                case "workEnd":
                    setWorkEnd(selectedDate);
                    break;
            }
        }
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <View style={{ padding: 20 }}>
            <Text>🛌 수면 시간 설정</Text>
            <Button title={`수면 시작: ${formatTime(sleepStart)}`} onPress={() => openPicker("sleepStart")} />
            <Button title={`수면 종료: ${formatTime(sleepEnd)}`} onPress={() => openPicker("sleepEnd")} />

            <Text style={{ marginTop: 20 }}>💼 일하는 시간 설정</Text>
            <Button title={`일 시작: ${formatTime(workStart)}`} onPress={() => openPicker("workStart")} />
            <Button title={`일 종료: ${formatTime(workEnd)}`} onPress={() => openPicker("workEnd")} />

            {showPicker.visible && (
                <DateTimePicker
                    mode="time"
                    value={
                        {
                            sleepStart,
                            sleepEnd,
                            workStart,
                            workEnd
                        }[showPicker.type]
                    }
                    onChange={handleChange}
                />
            )}
            <View style={{ marginTop: 30 }}>
                <Button
                    title="설정 완료"
                    onPress={async () => {
                        const printTime = (date) => {
                            const hours = date.getHours().toString().padStart(2, "0");
                            const minutes = date.getMinutes().toString().padStart(2, "0");
                            return `${hours}:${minutes}`;
                        };

                        console.log("수면 시작:", printTime(sleepStart));
                        console.log("수면 종료:", printTime(sleepEnd));
                        console.log("일 시작:", printTime(workStart));
                        console.log("일 종료:", printTime(workEnd));

                        await updateUserDoc({
                            sleepStart:printTime(sleepStart),
                            sleepEnd:printTime(sleepEnd),
                            workStart:printTime(workStart),
                            workEnd:printTime(workEnd)
                        })
                        
                        console.log("성공")
                    }}
                />
            </View>
        </View>
    );
}
