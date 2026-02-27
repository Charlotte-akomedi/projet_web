import { useToast } from "../../hooks/use-toast"; //  Chemin relatif pour corriger l'erreur Vite
import { 
  Toast, 
  ToastClose, 
  ToastDescription, 
  ToastProvider, 
  ToastTitle, 
  ToastViewport 
} from "./toast"; // ✅ Utilisation du chemin relatif local

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="bg-white border-[#2D5A43] rounded-2xl shadow-lg">
            <div className="grid gap-1">
              {title && <ToastTitle className="text-[#2D5A43] font-bold">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-gray-500 text-sm">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-gray-400 hover:text-[#2D5A43]" />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}