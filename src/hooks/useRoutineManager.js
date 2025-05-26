import {
    deleteRoutineOverride,
    getRoutineOverride,
    setRoutineOverride,
} from "@/api/routines/routineOverrides";
import {
    createRoutineRule,
    deleteRoutineRule,
    getRoutineRules,
    updateRoutineRule,
} from "@/api/routines/routineRules";
import { isDateWithinRule, matchesRepeatRule } from "@/utils/routineHelpers";
import { useState } from "react";

export default function useRoutineManager(userId) {
  const [routineForDate, setRoutineForDate] = useState([]);
  const [routineLoading, setRoutineLoading] = useState(false);
  const [routineSaving, setRoutineSaving] = useState(false);
  const [routineError, setRoutineError] = useState(null);

  // 🔍 특정 날짜 루틴 불러오기 (예외 > 반복)
  const fetchRoutineForDate = async (date) => {
    setRoutineLoading(true);
    setRoutineError(null);
    try {
      const override = await getRoutineOverride(userId, date);
      if (override) {
        setRoutineForDate(override.routines);
        return;
      }

      const rules = await getRoutineRules(userId);
      const matched = rules.find(rule =>
        isDateWithinRule(date, rule) && matchesRepeatRule(date, rule)
      );

      setRoutineForDate(matched ? matched.routines : []);
    } catch (err) {
      setRoutineError(err);
    } finally {
      setRoutineLoading(false);
    }
  };

  // 🟩 예외 루틴 저장
  const saveOverrideRoutine = async (date, routines) => {
    setRoutineSaving(true);
    setRoutineError(null);
    try {
      await setRoutineOverride(userId, date, routines);
    } catch (err) {
      setRoutineError(err);
    } finally {
      setRoutineSaving(false);
    }
  };

  // 🟩 반복 루틴 생성
  const saveRoutineRule = async (ruleData) => {
    setRoutineSaving(true);
    setRoutineError(null);
    try {
      await createRoutineRule(userId, ruleData);
    } catch (err) {
      setRoutineError(err);
    } finally {
      setRoutineSaving(false);
    }
  };

  // 🔁 반복 루틴 수정
  const editRoutineRule = async (ruleId, updatedData) => {
    setRoutineSaving(true);
    setRoutineError(null);
    try {
      await updateRoutineRule(userId, ruleId, updatedData);
    } catch (err) {
      setRoutineError(err);
    } finally {
      setRoutineSaving(false);
    }
  };

  // 🗑️ 루틴 삭제
  const deleteRoutine = async ({ type, idOrDate }) => {
    setRoutineSaving(true);
    setRoutineError(null);
    try {
      if (type === "rule") {
        await deleteRoutineRule(userId, idOrDate);
      } else if (type === "override") {
        await deleteRoutineOverride(userId, idOrDate);
      }
    } catch (err) {
      setRoutineError(err);
    } finally {
      setRoutineSaving(false);
    }
  };

  return {
    routineForDate,
    routineLoading,
    routineSaving,
    routineError,

    fetchRoutineForDate,
    saveOverrideRoutine,
    saveRoutineRule,
    editRoutineRule,
    deleteRoutine,
  };
}
