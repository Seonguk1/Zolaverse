import * as Calendar from 'expo-calendar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, Platform, Text, View } from 'react-native';

export default function CalendarEventsScreen() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    const getDefaultCalendarSource = async () => {
        if (Platform.OS === 'ios') {
            const defaultCalendar = await Calendar.getDefaultCalendarAsync();
            return defaultCalendar.source;
        } else {
            return { isLocalAccount: true, name: 'Expo Calendar' };
        }
    };

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const { status } = await Calendar.requestCalendarPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('권한 필요', '캘린더 접근 권한이 필요합니다.');
                setLoading(false);
                return;
            }

            const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
            const writableCalendars = calendars.filter(cal => cal.allowsModifications);

            // 캘린더 ID 목록 추출
            const calendarIds = writableCalendars.map(cal => cal.id);

            const now = new Date('2000-01-01');
            const end = new Date('2030-01-01');

            const events = await Calendar.getEventsAsync(calendarIds, now, end);

            setEvents(events);
        } catch (error) {
            console.error('캘린더 이벤트 가져오기 실패', error);
            Alert.alert('오류', '캘린더 이벤트를 가져오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const formatTime = (date) => {
        const d = new Date(date);
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>오늘의 캘린더 이벤트</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : events.length === 0 ? (
                <Text>오늘 등록된 일정이 없습니다.</Text>
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={{ paddingVertical: 8, borderBottomWidth: 1, borderColor: '#ccc' }}>
                            <Text style={{ fontWeight: 'bold' }}>{item.title || '(제목 없음)'}</Text>
                            <Text>
                                {formatTime(item.startDate)} ~ {formatTime(item.endDate)}
                            </Text>
                        </View>
                    )}
                />
            )}
            <Button title="새로고침" onPress={fetchEvents} />
        </View>
    );
}
