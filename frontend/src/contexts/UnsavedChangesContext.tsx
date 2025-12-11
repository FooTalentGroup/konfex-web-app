"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface UnsavedChangesContextType {
  hasUnsavedChanges: boolean;
  markAsChanged: () => void;
  markAsSaved: () => void;
  requestNavigation: (path: string) => void;
  onNavigationRequest?: (path: string) => boolean;
  setNavigationHandler: (handler: (path: string) => boolean) => void;
}

const UnsavedChangesContext = createContext<
  UnsavedChangesContextType | undefined
>(undefined);

export function UnsavedChangesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [navigationHandler, setNavigationHandler] = useState<
    ((path: string) => boolean) | undefined
  >();

  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  const markAsSaved = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  const requestNavigation = useCallback(
    (path: string) => {
      if (navigationHandler) {
        navigationHandler(path);
      }
    },
    [navigationHandler]
  );

  const setNavigationHandlerCallback = useCallback(
    (handler: (path: string) => boolean) => {
      setNavigationHandler(() => handler);
    },
    []
  );

  return (
    <UnsavedChangesContext.Provider
      value={{
        hasUnsavedChanges,
        markAsChanged,
        markAsSaved,
        requestNavigation,
        setNavigationHandler: setNavigationHandlerCallback,
      }}
    >
      {children}
    </UnsavedChangesContext.Provider>
  );
}

export function useUnsavedChangesContext() {
  const context = useContext(UnsavedChangesContext);
  if (!context) {
    return {
      hasUnsavedChanges: false,
      markAsChanged: () => {},
      markAsSaved: () => {},
      requestNavigation: () => {},
      setNavigationHandler: () => {},
    };
  }
  return context;
}
