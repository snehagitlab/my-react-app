export interface SocketMessageInterface {
    conversation_id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    _id: string;
    timestamp: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
export interface ChatObject {
    _id: string;
    type: number;
    name: null | string;
    participants: string[];
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface ConverSationObj {
    conversationId: string;
    name: string;
    lname: string;
    updatedAt: string;
    receiverId: string;
}

