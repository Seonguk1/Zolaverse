import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import useCharacterStore from '../store/useCharacterStore';

const CharacterInfoModal = ({ visible, onClose }) => {
    const { character, stats, career, education, achievements, setStats } = useCharacterStore();
    const [isEditing, setIsEditing] = useState(false);
    const [newNickname, setNewNickname] = useState(stats.nickname || '조랭이');

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleString('ko-KR');
    };

    const handleSaveNickname = () => {
        if (newNickname.trim()) {
            setStats({ ...stats, nickname: newNickname.trim() });
        }
        setIsEditing(false);
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>캐릭터 정보</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        <View style={styles.characterInfo}>
                            <Text style={styles.characterEmoji}>🦸‍♂️</Text>
                            <View style={styles.nicknameContainer}>
                                {isEditing ? (
                                    <View style={styles.editContainer}>
                                        <TextInput
                                            style={styles.nicknameInput}
                                            value={newNickname}
                                            onChangeText={setNewNickname}
                                            autoFocus={true}
                                            maxLength={10}
                                            onBlur={handleSaveNickname}
                                            onSubmitEditing={handleSaveNickname}
                                        />
                                        <TouchableOpacity 
                                            style={styles.saveButton}
                                            onPress={handleSaveNickname}
                                        >
                                            <Text style={styles.saveButtonText}>✓</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View style={styles.nicknameRow}>
                                        <Text style={styles.nickname}>{stats.nickname || '조랭이'}</Text>
                                        <TouchableOpacity 
                                            style={styles.editButton}
                                            onPress={() => setIsEditing(true)}
                                        >
                                            <Text style={styles.editButtonText}>✎</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </View>

                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>레벨</Text>
                                <Text style={styles.statValue}>{character.level}</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>가입일</Text>
                                <Text style={styles.statValue}>{formatDate(character.createdAt)}</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>마지막 접속</Text>
                                <Text style={styles.statValue}>{formatDate(character.lastLogin)}</Text>
                            </View>
                        </View>

                        <View style={[styles.statsContainer, styles.statsMargin]}>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>현금</Text>
                                <Text style={styles.statValue}>{stats.money.toLocaleString()}원</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>지식</Text>
                                <Text style={styles.statValue}>{stats.knowledge}</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>체력</Text>
                                <Text style={styles.statValue}>{stats.energy}/100</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>행복도</Text>
                                <Text style={styles.statValue}>{stats.happiness}/100</Text>
                            </View>
                        </View>

                        <View style={[styles.statsContainer, styles.statsMargin]}>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>대학</Text>
                                <Text style={styles.statValue}>{education.university}</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>전공</Text>
                                <Text style={styles.statValue}>{education.major}</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>학기</Text>
                                <Text style={styles.statValue}>{education.semester}학기</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>평점</Text>
                                <Text style={styles.statValue}>{education.gpa.toFixed(2)}</Text>
                            </View>
                        </View>

                        <View style={[styles.statsContainer, styles.statsMargin]}>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>총 수입</Text>
                                <Text style={styles.statValue}>{achievements.totalEarnings.toLocaleString()}원</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>총 공부 시간</Text>
                                <Text style={styles.statValue}>{achievements.totalStudyHours}시간</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>연속 기상</Text>
                                <Text style={styles.statValue}>{achievements.wakeUpStreak}일</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>최고 기상 기록</Text>
                                <Text style={styles.statValue}>{achievements.bestWakeUpStreak}일</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        width: '85%',
        maxWidth: 400,
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
    scrollView: {
        flexGrow: 0,
    },
    characterInfo: {
        alignItems: 'center',
        marginBottom: 24,
    },
    characterEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    nicknameContainer: {
        minWidth: 120,
    },
    nicknameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nickname: {
        fontSize: 24,
        fontWeight: '600',
        color: '#2C3E50',
        marginRight: 8,
    },
    editButton: {
        padding: 4,
    },
    editButtonText: {
        fontSize: 20,
        color: '#666',
    },
    editContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    nicknameInput: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2C3E50',
        padding: 0,
        minWidth: 100,
        textAlign: 'center',
    },
    saveButton: {
        padding: 4,
        marginLeft: 4,
    },
    saveButtonText: {
        fontSize: 20,
        color: '#2C5EFF',
        fontWeight: '600',
    },
    statsContainer: {
        backgroundColor: '#F8F9FA',
        borderRadius: 16,
        padding: 16,
        gap: 12,
    },
    statsMargin: {
        marginTop: 12,
    },
    statItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 16,
        color: '#666',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50',
    },
});

export default CharacterInfoModal; 