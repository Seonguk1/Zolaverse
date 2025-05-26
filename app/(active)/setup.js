import LoadingView from "@/components/loading/LoadingView";
import RoutineInput from "@/components/RoutineInput";
import useRoutineManager from "@/hooks/useRoutineManager";
import useGetUserDoc from "@/hooks/useUser/useGetUserDoc";
import { useState } from "react";
import { Alert, Button, ScrollView, Text } from "react-native";

export default function Setup() {
    const { user, userDoc, userLoading } = useGetUserDoc();

    if (userLoading) {

        return <LoadingView />
    }

    const {
        saveRoutineRule,
        routineSaving,
        routineError,
    } = useRoutineManager(user?.uid);
    console.log(user?.uid)
    const [startDate, setStartDate] = useState("2025-06-01");
    const [repeat, setRepeat] = useState(true);
    const [repeatType, setRepeatType] = useState("weekly");
    const [repeatDays, setRepeatDays] = useState(["mon", "tue", "wed", "thu", "fri"]);
    const [until, setUntil] = useState("2025-08-01");
    const [routines, setRoutines] = useState([
        { category: "sleep", start: "23:00", end: "07:00" },
        { category: "work", start: "09:00", end: "18:00" }
    ]);

    const handleSave = async () => {
        try {
            await saveRoutineRule({ startDate, repeat, repeatType, repeatDays, until, routines });
            Alert.alert("루틴 저장 완료", "기본 루틴이 저장되었습니다");
        } catch (err) {
            Alert.alert("오류", "루틴 저장 중 문제가 발생했습니다");
        }
    };

    return (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>기본 루틴 설정</Text>

            <RoutineInput
                routines={routines}
                setRoutines={setRoutines}
            />

            {/* 반복 설정 정보는 추후 date picker나 toggle 등 UI 연동 */}
            <Text style={{ marginVertical: 10 }}>시작일: {startDate}</Text>
            <Text>종료일: {until}</Text>
            <Text>반복: {repeat ? `(${repeatType}) ${repeatDays.join(", ")}` : "안 함"}</Text>

            <Button title={routineSaving ? "저장 중..." : "루틴 저장"} onPress={handleSave} disabled={routineSaving} />
            
            {routineError && <Text style={{ color: "red" }}>에러: {routineError.message}</Text>}
        </ScrollView>
    );
}
