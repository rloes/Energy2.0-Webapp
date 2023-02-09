import create from "zustand";


const useAuthStore = create((set) => ({
    token: "",
    username: "",
    email: "",
    setState: (name, value) => set((state) => ({[name]: value})),
    isAdmin: false,
    consumerId: false,
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('consumerID');
        set((state) => ({
            token: "",
            username: "",
            email: "",
            isAdmin: false,
            consumerId: false,
        }))
    }
}))

export default useAuthStore