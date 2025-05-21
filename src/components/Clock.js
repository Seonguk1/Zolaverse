import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";

const ACTIVITIES = {
    SLEEP: { id: 'sleep', color: '#7B8788', icon: '😴', label: '수면' },
    STUDY: { id: 'study', color: '#2C5EFF', icon: '📚', label: '공부' },
    WORK: { id: 'work', color: '#FFB800', icon: '💼', label: '알바' },
    EXERCISE: { id: 'exercise', color: '#FF4B4B', icon: '🏃', label: '운동' },
    REST: { id: 'rest', color: '#00BA34', icon: '🎮', label: '휴식' },
};

const Clock = ({ 
    size = 80, 
    showLabel = false, 
    showHourMarkers = false, 
    style,
    schedule = {},
    onHourPress,
    selectedHour = null,
    showCurrentTime = true
}) => {
    const currentTime = new Date();
    
    const hourMarkers = Array.from({ length: 24 }, (_, hour) => {
        const angle = (hour / 24) * 360 - 90;
        const radius = size * 0.56;
        const x = Math.cos(angle * Math.PI / 180) * radius;
        const y = Math.sin(angle * Math.PI / 180) * radius;

        return (
            <Text
                key={hour}
                style={[
                    styles.hourMarkerText,
                    {
                        position: 'absolute',
                        fontSize: size/13,
                        left: x + size/2,
                        top: y + size/2,
                        transform: [{ translateX: -size/40 }, { translateY: -size/26 }],
                        zIndex: 1
                    }
                ]}
            >
                {hour}
            </Text>
        );
    });

    // 시계 바늘 각도 계산
    const hourAngle = (currentTime.getHours() + currentTime.getMinutes() / 60) * 15;
    const minuteAngle = currentTime.getMinutes() * 6;
    const secondAngle = currentTime.getSeconds() * 6;

    // 시계 바늘 좌표 계산
    const getHandCoordinates = (angle, length) => {
        const radian = (angle - 90) * Math.PI / 180;
        return {
            x2: size/2 + Math.cos(radian) * length,
            y2: size/2 + Math.sin(radian) * length
        };
    };

    const hourHand = getHandCoordinates(hourAngle, size * 0.25);
    const minuteHand = getHandCoordinates(minuteAngle, size * 0.35);
    const secondHand = getHandCoordinates(secondAngle, size * 0.4);

    // 스케줄 세그먼트 그리기
    const renderScheduleSegments = () => {
        return Array.from({ length: 24 }, (_, hour) => {
            const startAngle = (hour / 24) * 360 - 90;
            const endAngle = ((hour + 1) / 24) * 360 - 90;
            const radius = size/2;
            
            const start = {
                x: size/2 + Math.cos(startAngle * Math.PI / 180) * radius,
                y: size/2 + Math.sin(startAngle * Math.PI / 180) * radius
            };
            
            const end = {
                x: size/2 + Math.cos(endAngle * Math.PI / 180) * radius,
                y: size/2 + Math.sin(endAngle * Math.PI / 180) * radius
            };
            
            const largeArcFlag = "0";
            const activity = schedule[hour];
            
            return (
                <TouchableOpacity
                    key={hour}
                    onPress={() => onHourPress?.(hour)}
                >
                    <Path
                        d={`M ${size/2} ${size/2} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`}
                        fill={activity ? ACTIVITIES[activity].color : '#F0F0F0'}
                        opacity={selectedHour === hour ? 1 : 0.7}
                    />
                </TouchableOpacity>
            );
        });
    };

    return (
        <View style={{ width: size, height: size, position: 'relative' }}>
            {showHourMarkers && hourMarkers}
            <View style={[styles.clockContainer, { width: size, height: size }, style]}>
                <Svg width={size} height={size}>
                    {/* 시계 배경 */}
                    <Circle
                        cx={size/2}
                        cy={size/2}
                        r={size/2}
                        fill="#F0F0F0"
                    />
                    
                    {/* 스케줄 세그먼트 */}
                    {renderScheduleSegments()}

                    {/* 시계 바늘 */}
                    {showCurrentTime && (
                        <>
                            <Line
                                x1={size/2}
                                y1={size/2}
                                x2={hourHand.x2}
                                y2={hourHand.y2}
                                stroke="#000"
                                strokeWidth={size/40}
                                strokeLinecap="round"
                            />
                            <Line
                                x1={size/2}
                                y1={size/2}
                                x2={minuteHand.x2}
                                y2={minuteHand.y2}
                                stroke="#000"
                                strokeWidth={size/40}
                                strokeLinecap="round"
                            />
                            <Line
                                x1={size/2}
                                y1={size/2}
                                x2={secondHand.x2}
                                y2={secondHand.y2}
                                stroke="#FF0000"
                                strokeWidth={size/80}
                                strokeLinecap="round"
                            />
                        </>
                    )}

                    {/* 중앙 점 */}
                    <Circle
                        cx={size/2}
                        cy={size/2}
                        r={size/26}
                        fill="#000"
                    />
                </Svg>

                {showLabel && schedule[currentTime.getHours()] && (
                    <View style={[styles.timeLabel, { 
                        top: size * 0.15,
                        right: size * 0.2,
                        width: size * 0.2,
                        height: size * 0.2,
                        backgroundColor: ACTIVITIES[schedule[currentTime.getHours()]].color + '40'
                    }]}>
                        <Text style={styles.timeLabelText}>
                            {ACTIVITIES[schedule[currentTime.getHours()]].icon}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    clockContainer: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 1000,
        overflow: 'hidden',
    },
    timeLabel: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 1000,
    },
    timeLabelText: {
        fontSize: 16,
        textAlign: 'center',
    },
    hourMarkerText: {
        color: '#000',
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default Clock; 