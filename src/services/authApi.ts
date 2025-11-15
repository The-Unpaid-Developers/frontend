export const login = async (username: string, role: string) => {
    localStorage.setItem("userToken", role);
    localStorage.setItem("username", username);
    return { token: role };
}