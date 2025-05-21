import CharacterInfoModal from '@/components/CharacterInfoModal';
import Clock from '@/components/Clock';
import SettingsModal from '@/components/SettingsModal';
import StatsPanel from '@/components/StatsPanel';
import useCharacterStore from '@/store/useCharacterStore';
import { useEffect, useState } from "react";
import { Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    Easing,
    cancelAnimation,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from "react-native-reanimated";

const Home = () => {
    const [showModal, setShowModal] = useState(false);
    const [showClockModal, setShowClockModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const translateY = useSharedValue(0);
    const [currentTime, setCurrentTime] = useState(new Date());
    const { stats } = useCharacterStore();

    useEffect(() => {
        translateY.value = withRepeat(
            withTiming(20, {
                duration: 1000,
                easing: Easing.inOut(Easing.ease),
            }),
            -1,
            true
        );

        return () => {
            cancelAnimation(translateY);
        };
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    {/* 상단 정보 */}
                    <View style={styles.topInfo}>
                        <View>
                            <View style={styles.moneyBubble}>
                                <Text style={styles.moneyText}>{stats.money.toLocaleString()}원</Text>
                            </View>
                            <TouchableOpacity 
                                style={styles.clockContainer}
                                onPress={() => setShowClockModal(true)}
                            >
                                <Clock />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.timeBubble}>
                            <Text style={styles.timeText}>
                                {currentTime.getFullYear()}. {currentTime.getMonth() + 1}. {currentTime.getDate()}.{'\n'}
                                오후 {currentTime.getHours() % 12 || 12}:{currentTime.getMinutes().toString().padStart(2, '0')}:{currentTime.getSeconds().toString().padStart(2, '0')}
                            </Text>
                        </View>
                        <TouchableOpacity 
                            style={styles.settingsButton}
                            onPress={() => setShowSettingsModal(true)}
                        >
                            <Text style={styles.settingsText}>⚙️</Text>
                        </TouchableOpacity>
                    </View>

                    {/* 캐릭터 섹션 */}
                    <View style={styles.characterSection}>
                        <View style={styles.messageBubble}>
                            <Text style={styles.messageText}>일찍 일어나는 새가 벌레를 잡는다.</Text>
                        </View>
                        <TouchableOpacity onPress={() => setShowModal(true)}>
                            <Animated.View style={[styles.characterWrapper, animatedStyle]}>
                                <Text style={styles.characterEmoji}>🦸‍♂️</Text>
                            </Animated.View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 스탯 패널 */}
                <StatsPanel />

                {/* 시계 모달 */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={showClockModal}
                    onRequestClose={() => setShowClockModal(false)}
                >
                    <TouchableOpacity 
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setShowClockModal(false)}
                    >
                        <View style={styles.clockModalContent}>
                            <Clock size={250} showLabel={true} showHourMarkers={true} style={styles.largeClock} />
                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* 캐릭터 정보 모달 */}
                <CharacterInfoModal 
                    visible={showModal} 
                    onClose={() => setShowModal(false)} 
                />

                {/* 설정 모달 */}
                <SettingsModal
                    visible={showSettingsModal}
                    onClose={() => setShowSettingsModal(false)}
                />
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    content: {
        flex: 1,
        padding: 24,
        paddingBottom: 240,
    },
    topInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 24,
    },
    moneyBubble: {
        backgroundColor: "white",
        padding: 12,
        borderRadius: 16,
        minWidth: 120,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    moneyText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#2C3E50",
    },
    clockContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    timeBubble: {
        backgroundColor: "white",
        padding: 12,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    timeText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#2C3E50",
        textAlign: 'center',
        lineHeight: 22,
    },
    settingsButton: {
        padding: 12,
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    settingsText: {
        fontSize: 22,
    },
    characterSection: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20,
    },
    messageBubble: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 20,
        maxWidth: '85%',
        marginBottom: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    messageText: {
        fontSize: 17,
        fontWeight: "500",
        textAlign: 'center',
        color: "#2C3E50",
        lineHeight: 24,
    },
    characterWrapper: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: 'white',
        borderRadius: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 5,
    },
    characterEmoji: {
        fontSize: 120,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    clockModalContent: {
        backgroundColor: 'white',
        padding: 32,
        borderRadius: 24,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 8,
    },
    largeClock: {
        marginBottom: 24,
    },
    clockModalTime: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2C3E50',
        letterSpacing: 1,
    },
});

export default Home;