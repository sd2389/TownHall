"use client";

import * as React from "react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

const ToastContext = React.createContext<{
  toast: (props: Omit<Toast, "id">) => void;
}>({
  toast: () => {},
});

export function useToast() {
  const context = React.useContext(ToastContext);
  
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = (props: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(7);
    const newToast: Toast = { ...props, id };
    
    setToasts((prev) => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-0 right-0 p-4 z-50 space-y-2">
        {toasts.map((toast) => {
          const baseClasses = "rounded-lg p-4 shadow-lg min-w-[300px] max-w-md";
          const variantClasses = toast.variant === "destructive"
            ? "bg-red-500 text-white"
            : "bg-white text-gray-900 border border-gray-200";
          
          return (
            <div
              key={toast.id}
              className={`${baseClasses} ${variantClasses}`}
            >
              {toast.title && (
                <h4 className="font-semibold mb-1">{toast.title}</h4>
              )}
              {toast.description && (
                <p className="text-sm">{toast.description}</p>
              )}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}