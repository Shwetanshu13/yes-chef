"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const ToastContext = createContext({ toast: () => {} });

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(
    ({ title, description, type = "info", duration = 3200 }) => {
      const id = ++idCounter;
      setToasts((t) => [...t, { id, title, description, type }]);
      setTimeout(
        () => setToasts((t) => t.filter((x) => x.id !== id)),
        duration
      );
    },
    []
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="rounded-xl border border-border px-4 py-3 shadow-lg backdrop-blur"
          >
            <p className="text-sm font-semibold">{t.title}</p>
            {t.description && (
              <p className="text-xs text-muted">{t.description}</p>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
