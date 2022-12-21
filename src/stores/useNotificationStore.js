import create from "zustand";

const useNotificationStore = create((set) => ({
    severity: "",
    message: "",
    setNotification: ({severity, message}) => set(state=>({severity, message}))
}))

export default useNotificationStore