import * as Calendar from 'expo-calendar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, SafeAreaView } from 'react-native';
import { Calendar as BigCalendar, } from 'react-native-big-calendar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
export default function CalendarScreen() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date());
    const [calendarIds, setCalendarIds] = useState(null);
    const [range, setRange] = useState({ start: null, end: null });

    const getDefaultCalendarSource = async () => {
        if (Platform.OS === 'ios') {
            const defaultCalendar = await Calendar.getDefaultCalendarAsync();
            return defaultCalendar.source;
        } else {
            return { isLocalAccount: true, name: 'Expo Calendar' };
        }
    };

    const fetchEventsInRange = async (start, end) => {
        if (!calendarIds) return;

        const nativeEvents = await Calendar.getEventsAsync(calendarIds, start, end);

        // 이벤트 형식 변환
        const formattedEvents = nativeEvents.map(evt => ({
            title: evt.title || '제목 없음',
            start: new Date(evt.startDate),
            end: new Date(evt.endDate),

        }));
        // console.log(nativeEvents);
        // console.log(formattedEvents);
        setEvents(formattedEvents);
        
    }

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
            setCalendarIds(calendars.map(cal => cal.id))

            const start = new Date('2025-01-01T09:00:00');
            const end = new Date('2025-12-01T09:00:00');

            fetchEventsInRange(start, end);


        } catch (error) {
            console.error('캘린더 이벤트 가져오기 실패', error);
            Alert.alert('오류', '캘린더 이벤트를 가져오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            await fetchEvents();
        };
        init();
    }, []);

    if (loading) return <ActivityIndicator size="large" />;

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <GestureHandlerRootView style={{ flex: 1 }}>
                <BigCalendar
                    events={events}
                    height={600}
                    mode="3days"
                    onLongPressCell={async (date) => {
                        await Calendar.createEventInCalendarAsync({
                            title: 'React Native 회의',
                            startDate: date,
                            endDate: date,
                            location: '서울 강남구',
                            notes: 'expo-calendar 다이얼로그 테스트',
                        });
                    }}
                    onPressDateHeader={(date) => {
                        setDate([date]);
                    }}
                    // onChangeDate={([start, end]) => {
                    //     console.log()
                    //     if (!calendarIds) return;
                    //     const isSameRange =
                    //         range.start?.getTime() === start.getTime() &&
                    //         range.end?.getTime() === end.getTime();

                    //     if (!isSameRange) {
                    //         console.log("📅 날짜 범위 변경됨:", start, end);
                    //         setRange({ start, end });
                    //         fetchEventsInRange(start, end);
                    //     }
                    // }}
                    dayHeaderHighlightColor='red'
                    activeDate={date}
                    date={date}
                // swipeEnabled={true}
                // eventCellTextColor='red'
                // allDayEventCellTextColor='purple'
                // dayHeaderHighlightColor='yellow'
                // locale='ko'
                // verticalScrollEnabled={true}

                />
            </GestureHandlerRootView>
        </SafeAreaView>
    );
}
