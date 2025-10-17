const token = () => localStorage.getItem('auth_token')

const putToken = (token : string) => localStorage.setItem('auth_token',token)

const deleteToken = () => localStorage.removeItem('auth_token')

export default {token,putToken,deleteToken}