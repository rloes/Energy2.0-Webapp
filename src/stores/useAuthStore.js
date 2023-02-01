import create from "zustand";


const useAuthStore = create((set) => ({
    token: "",
    username: "",
    email: "",
    setState: (name, value) => set((state) => ({[name]: value})),
    isAdmin: false,
    consumerId: false
}))

export default useAuthStore