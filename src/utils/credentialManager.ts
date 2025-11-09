import { STORAGE_KEYS } from '@/config/storageKeys';
import { getUserIdFromToken, getUserEmailFromToken } from './jwtDecoder';

const token = () => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)

const putToken = (token : string) => localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)

const deleteToken = () => localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)

const getUserId = () => getUserIdFromToken(token())

const getUserEmail = () => getUserEmailFromToken(token())

export default {token, putToken, deleteToken, getUserId, getUserEmail}