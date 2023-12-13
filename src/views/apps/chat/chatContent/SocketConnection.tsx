import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL

const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
export const socket = io(`${SOCKET_URL}`, {
    transports: ['websocket'],
    auth: { token: `Bearer ${UserData.token}` },
    reconnection: true,
    reconnectionAttempts: 3,
    reconnectionDelay: 1000
});
