import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_APP_SOCKET_URL

const UserData: any = JSON.parse(localStorage.getItem('user1Data') || '{}')
export const socket = io(`${SOCKET_URL}?bearerToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMDZiMzg0Mi00ZDc1LTQwNGYtYThkZS0yMTIwYmFkYmI1NjkiLCJlbWFpbCI6InZpbmF5YWtAZ21haWwuY29tIiwiaWF0IjoxNzA2NTkzODU3LCJleHAiOjE3MDY2ODAyNTd9.aB7eVNeMpw0FKkmGUWZPRUScqZk7wSzceMtxrT-qD6I`, {
    //export const socket = io(`${SOCKET_URL}?bearerToken=${UserData.token}`, {
    // transports: ['websocket'],
    // auth: { token: `Bearer ${UserData.token}` },
    reconnection: true,
    reconnectionAttempts: 3,
    reconnectionDelay: 1000
});
