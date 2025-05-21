import Clock from '@/components/Clock';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

const ACTIVITIES = {
  SLEEP: { id: 'sleep', color: '#7B8788', icon: '😴' },
  STUDY: { id: 'study', color: '#2C5EFF', icon: '📚' },
  WORK: { id: 'work', color: '#FFB800', icon: '💼' },
  EXERCISE: { id: 'exercise', color: '#FF4B4B', icon: '🏃' },
  REST: { id: 'rest', color: '#00BA34', icon: '🎮' },
};

const Schedule = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [schedules, setSchedules] = useState({});
  
  // 달력의 날짜 렌더링을 커스텀하는 함수
  const renderDay = (date) => {
    if (!date) return null;
    
    return (
      <View style={styles.dayContainer}>
        <Text style={styles.dayText}>{date.day}</Text>
        <Clock 
          size={40} 
          schedule={schedules[date.dateString]} 
          showCurrentTime={false}
          showHourMarkers={false}
        />
      </View>
    );
  };

  // 날짜를 선택했을 때 처리하는 함수
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    router.push(`/schedule/${day.dateString}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>스케줄 관리</Text>
        <Text style={styles.subtitle}>날짜를 선택하여 스케줄을 관리하세요</Text>
      </View>
      
      <Calendar
        style={styles.calendar}
        dayComponent={({ date }) => renderDay(date)}
        onDayPress={handleDayPress}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#000000',
          selectedDayBackgroundColor: '#2C5EFF',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#2C5EFF',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6C757D',
  },
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dayContainer: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default Schedule; 