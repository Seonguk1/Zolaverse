import { Button, Text, TextInput, View } from "react-native";

export default function RoutineInput({ routines, setRoutines }) {
  const handleChange = (index, field, value) => {
    const updated = [...routines];
    updated[index][field] = value;
    setRoutines(updated);
  };

  const handleAdd = () => {
    setRoutines([...routines, { category: "", start: "", end: "" }]);
  };

  const handleRemove = (index) => {
    const updated = routines.filter((_, i) => i !== index);
    setRoutines(updated);
  };

  return (
    <View style={{ gap: 16 }}>
      {routines.map((routine, index) => (
        <View key={index} style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}>
          <Text>카테고리</Text>
          <TextInput
            value={routine.category}
            onChangeText={(text) => handleChange(index, "category", text)}
            placeholder="예: sleep"
            style={{ borderBottomWidth: 1, marginBottom: 8 }}
          />

          <Text>시작 시간</Text>
          <TextInput
            value={routine.start}
            onChangeText={(text) => handleChange(index, "start", text)}
            placeholder="예: 23:00"
            style={{ borderBottomWidth: 1, marginBottom: 8 }}
          />

          <Text>종료 시간</Text>
          <TextInput
            value={routine.end}
            onChangeText={(text) => handleChange(index, "end", text)}
            placeholder="예: 07:00"
            style={{ borderBottomWidth: 1, marginBottom: 8 }}
          />

          <Button title="삭제" onPress={() => handleRemove(index)} color="red" />
        </View>
      ))}

      <Button title="루틴 추가" onPress={handleAdd} />
    </View>
  );
}
