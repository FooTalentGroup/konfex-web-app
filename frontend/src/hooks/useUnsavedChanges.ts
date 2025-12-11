"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export function useUnsavedChanges() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  const markAsSaved = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  const handleNavigation = useCallback(
    (path: string) => {
      if (hasUnsavedChanges) {
        setPendingNavigation(path);
        setShowModal(true);
        return false;
      }
      router.push(path);
      return true;
    },
    [hasUnsavedChanges, router]
  );

  const handleSave = useCallback(() => {
    setShowModal(false);
    return pendingNavigation;
  }, [pendingNavigation]);

  const handleContinueEditing = useCallback(() => {
    setShowModal(false);
    setPendingNavigation(null);
  }, []);

  const handleExitWithoutSaving = useCallback(() => {
    setHasUnsavedChanges(false);
    setShowModal(false);
    if (pendingNavigation) {
      router.push(pendingNavigation);
    }
  }, [pendingNavigation, router]);

  return {
    hasUnsavedChanges,
    showModal,
    markAsChanged,
    markAsSaved,
    handleNavigation,
    handleSave,
    handleContinueEditing,
    handleExitWithoutSaving,
  };
}
