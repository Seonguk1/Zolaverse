import { useEffect, useState } from 'react';
import { Animated, Modal, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const SettingItem = ({ title, description, value, onValueChange, type = "switch" }) => {
    return (
        <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{title}</Text>
                {description && (
                    <Text style={styles.settingDescription}>{description}</Text>
                )}
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: "#D1D1D6", true: "#81B0FF" }}
                thumbColor={value ? "#2C5EFF" : "#F4F4F4"}
            />
        </View>
    );
};

const SettingsModal = ({ visible, onClose }) => {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [soundEffects, setSoundEffects] = useState(true);
    const [sleepReminder, setSleepReminder] = useState(true);
    const [showModal, setShowModal] = useState(visible);
    const fadeAnim = useState(new Animated.Value(0))[0];

    useEffect(() => {
        if (visible) {
            setShowModal(true);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                setShowModal(false);
            });
        }
    }, [visible]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            onRequestClose={onClose}
        >
            <Animated.View 
                style={[
                    styles.modalOverlay,
                    {
                        backgroundColor: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.4)']
                        })
                    }
                ]}
            >
                <TouchableOpacity 
                    style={{ flex: 1 }}
                    activeOpacity={1}
                    onPress={onClose}
                >
                    <View style={{ flex: 1 }} />
                </TouchableOpacity>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>설정</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.settingsList}>
                        <SettingItem
                            title="알림"
                            description="게임 알림을 받습니다"
                            value={notifications}
                            onValueChange={setNotifications}
                        />
                        <SettingItem
                            title="다크 모드"
                            description="어두운 테마를 사용합니다"
                            value={darkMode}
                            onValueChange={setDarkMode}
                        />
                        <SettingItem
                            title="효과음"
                            description="게임 효과음을 재생합니다"
                            value={soundEffects}
                            onValueChange={setSoundEffects}
                        />
                        <SettingItem
                            title="수면 알림"
                            description="수면 시간에 알림을 보냅니다"
                            value={sleepReminder}
                            onValueChange={setSleepReminder}
                        />
                    </View>

                    <View style={styles.versionInfo}>
                        <Text style={styles.versionText}>버전 1.0.0</Text>
                    </View>
                </View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 20,
        paddingHorizontal: 24,
        paddingBottom: 34,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#2C3E50',
    },
    closeButton: {
        padding: 8,
    },
    closeButtonText: {
        fontSize: 24,
        color: '#2C3E50',
        fontWeight: '300',
    },
    settingsList: {
        gap: 24,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    settingInfo: {
        flex: 1,
        marginRight: 16,
    },
    settingTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 14,
        color: '#666',
    },
    versionInfo: {
        marginTop: 32,
        alignItems: 'center',
    },
    versionText: {
        fontSize: 14,
        color: '#999',
    },
});

export default SettingsModal; 