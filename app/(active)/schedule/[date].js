import Clock from '@/components/Clock';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ACTIVITIES = {
  SLEEP: { id: 'sleep', color: '#7B8788', icon: '😴', label: '수면' },
  STUDY: { id: 'study', color: '#2C5EFF', icon: '📚', label: '공부' },
  WORK: { id: 'work', color: '#FFB800', icon: '💼', label: '알바' },
  EXERCISE: { id: 'exercise', color: '#FF4B4B', icon: '🏃', label: '운동' },
  REST: { id: 'rest', color: '#00BA34', icon: '🎮', label: '휴식' },
};

export default function DaySchedule() {
  const { date } = useLocalSearchParams();
  const router = useRouter();
  const [schedule, setSchedule] = useState({});
  const [selectedHour, setSelectedHour] = useState(null);

  // 활동 선택 처리
  const handleActivitySelect = (activityKey) => {
    if (selectedHour === null) return;
    
    setSchedule(prev => ({
      ...prev,
      [selectedHour]: activityKey
    }));
    setSelectedHour(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{date}</Text>
      
      <View style={styles.clockContainer}>
        <Clock
          size={280}
          schedule={schedule}
          onHourPress={setSelectedHour}
          selectedHour={selectedHour}
          showCurrentTime={false}
          showHourMarkers={true}
        />
      </View>

      {selectedHour !== null && (
        <View style={styles.activitySelector}>
          <Text style={styles.timeText}>{`${selectedHour}:00 - ${(selectedHour + 1) % 24}:00`}</Text>
          <ScrollView horizontal style={styles.activitiesList}>
            {Object.entries(ACTIVITIES).map(([key, activity]) => (
              <TouchableOpacity
                key={key}
                style={[styles.activityButton, { backgroundColor: activity.color + '20' }]}
                onPress={() => handleActivitySelect(key)}
              >
                <Text style={styles.activityIcon}>{activity.icon}</Text>
                <Text style={styles.activityLabel}>{activity.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  dateText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  clockContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  activitySelector: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  activitiesList: {
    flexDirection: 'row',
    paddingBottom: 20,
  },
  activityButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginRight: 10,
    width: 80,
  },
  activityIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  activityLabel: {
    fontSize: 12,
    color: '#2C3E50',
    textAlign: 'center',
  },
}); 