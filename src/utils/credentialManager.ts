import { STORAGE_KEYS } from '@/config/storageKeys';

const token = () => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)

const putToken = (token : string) => localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)

const deleteToken = () => localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)

export default {token, putToken, deleteToken}