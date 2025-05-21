import { Dimensions, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MIN_HEIGHT = 50; // 최소 높이
const MAX_HEIGHT = SCREEN_HEIGHT * 0.8; // 최대 높이 (화면의 80%)
const INITIAL_HEIGHT = MIN_HEIGHT; // 초기 높이

const StatsPanel = () => {
    const height = useSharedValue(INITIAL_HEIGHT);
    const startHeight = useSharedValue(INITIAL_HEIGHT);

    const panGesture = Gesture.Pan()
        .onStart(() => {
            startHeight.value = height.value;
        })
        .onUpdate((event) => {
            // 위로 드래그하면 음수, 아래로 드래그하면 양수
            const newHeight = startHeight.value - event.translationY;
            // 최소/최대 높이 제한
            height.value = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, newHeight));
        })
        .onEnd((event) => {
            // 빠른 속도로 드래그하거나, 중간 지점을 넘었을 때 스냅
            const velocityThreshold = -500; // 위로 빠르게 드래그할 때
            const positionThreshold = (MAX_HEIGHT + MIN_HEIGHT) / 2;
            
            const shouldExpand = 
                event.velocityY < velocityThreshold || // 위로 빠르게 드래그
                (Math.abs(event.velocityY) < 500 && height.value > positionThreshold); // 천천히 드래그하고 중간을 넘음

            height.value = withSpring(
                shouldExpand ? MAX_HEIGHT : MIN_HEIGHT,
                {
                    damping: 50,
                    stiffness: 300,
                    velocity: -event.velocityY, // 속도의 방향을 반대로
                }
            );
        });

    const animatedStyle = useAnimatedStyle(() => ({
        height: height.value,
    }));

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.container, animatedStyle]}>
                <View style={styles.handle} />
                <View style={styles.content}>
                    
                </View>
            </Animated.View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingTop: 12,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#ffffff50',
        alignSelf: 'center',
        marginBottom: 10,
        borderRadius: 2,
    },
    content: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 15,
        padding: 16,
        flex: 1,
    },
});

export default StatsPanel; 