import { create } from 'zustand';

const useCharacterStore = create((set) => ({
    // 캐릭터 기본 정보
    character: {
        name: '졸라맨',
        job: '알바생 대학생',
        level: 1,
        createdAt: new Date(),
        lastLogin: new Date(),
        lastWakeUpTime: null,
        nextWakeUpTime: null,
    },

    // 능력치
    stats: {
        money: 50000,        // 현금
        knowledge: 10,       // 지식
        energy: 100,         // 체력 (100이 최대)
        happiness: 70,       // 행복도
        nickname: '조랭이',
    },

    // 일과 관리
    schedule: {
        sleep: 8,            // 수면 시간 (고정 8시간)
        work: 8,            // 일하는 시간
        study: 8,           // 공부하는 시간
    },

    // 직업 정보
    career: {
        currentJob: '편의점 알바',
        hourlyWage: 9620,    // 시급
        experience: 0,       // 직업 경험치
        availableJobs: ['편의점 알바'],  // 해금된 직업들
    },

    // 학업 정보
    education: {
        university: '졸라대학교',
        major: '졸라학과',
        semester: 1,         // 학기
        credits: 0,          // 이수 학점
        gpa: 0,             // 평점
    },

    // 업적 및 기록
    achievements: {
        totalEarnings: 0,    // 총 수입
        totalStudyHours: 0,  // 총 공부 시간
        perfectSchedule: 0,   // 계획대로 완벽하게 실천한 날
        wakeUpStreak: 0,     // 연속 기상 스트릭
        bestWakeUpStreak: 0, // 최고 연속 기상 기록
    },

    // 이벤트/버프 상태
    status: {
        activeBuffs: [],     // 활성화된 버프들
        dailyLuck: 0,       // 오늘의 행운 수치 (0~100)
        specialEvents: [],   // 진행 중인 특별 이벤트
    },

    // Actions
    // 기본 스케줄 설정
    setSchedule: (workHours, studyHours) =>
        set((state) => ({
            schedule: {
                ...state.schedule,
                work: workHours,
                study: studyHours,
            }
        })),

    // 일하기 액션
    work: (hours) =>
        set((state) => {
            const earned = state.career.hourlyWage * hours;
            return {
                stats: {
                    ...state.stats,
                    money: state.stats.money + earned,
                    energy: Math.max(0, state.stats.energy - (hours * 5)),
                },
                achievements: {
                    ...state.achievements,
                    totalEarnings: state.achievements.totalEarnings + earned,
                }
            };
        }),

    // 공부하기 액션
    study: (hours) =>
        set((state) => ({
            stats: {
                ...state.stats,
                knowledge: state.stats.knowledge + (hours * 0.5),
                energy: Math.max(0, state.stats.energy - (hours * 4)),
            },
            achievements: {
                ...state.achievements,
                totalStudyHours: state.achievements.totalStudyHours + hours,
            }
        })),

    // 잠자기 액션
    sleep: () =>
        set((state) => ({
            stats: {
                ...state.stats,
                energy: 100, // 체력 완전 회복
            },
            character: {
                ...state.character,
                lastWakeUpTime: new Date(),
                nextWakeUpTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8시간 후
            }
        })),

    // 새로운 직업 해금
    unlockJob: (jobName, requiredWage) =>
        set((state) => ({
            career: {
                ...state.career,
                availableJobs: [...state.career.availableJobs, jobName],
                hourlyWage: requiredWage,
                currentJob: jobName,
            }
        })),

    // 일일 업데이트 (로그인 시 호출)
    updateDaily: () =>
        set((state) => ({
            status: {
                ...state.status,
                dailyLuck: Math.floor(Math.random() * 101), // 0-100 사이 랜덤 행운
                activeBuffs: [], // 버프 초기화
            },
            character: {
                ...state.character,
                lastLogin: new Date(),
            }
        })),

    // 기상 체크 및 보상
    checkWakeUp: (currentTime) =>
        set((state) => {
            const nextWakeUpTime = state.character.nextWakeUpTime;
            if (!nextWakeUpTime) return state;

            const isOnTime = Math.abs(currentTime - nextWakeUpTime) < 5 * 60 * 1000; // 5분 오차 허용
            if (isOnTime) {
                return {
                    achievements: {
                        ...state.achievements,
                        wakeUpStreak: state.achievements.wakeUpStreak + 1,
                        bestWakeUpStreak: Math.max(
                            state.achievements.bestWakeUpStreak,
                            state.achievements.wakeUpStreak + 1
                        ),
                    },
                    stats: {
                        ...state.stats,
                        happiness: Math.min(100, state.stats.happiness + 10),
                    }
                };
            } else {
                return {
                    achievements: {
                        ...state.achievements,
                        wakeUpStreak: 0,
                    },
                    stats: {
                        ...state.stats,
                        happiness: Math.max(0, state.stats.happiness - 10),
                    }
                };
            }
        }),

    setStats: (newStats) => set((state) => ({
        stats: { ...state.stats, ...newStats }
    })),
}));

export default useCharacterStore; 