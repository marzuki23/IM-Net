export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER'
}

export interface WiFiPackage {
    id: string;
    name: string;
    speed: string;
    price: number;
}

export interface Payment {
    id: string;
    userId: string;
    amount: number;
    month: string;
    status: 'PENDING' | 'PAID';
    date: string;
}

export interface User {
    id: string;
    username: string;
    fullName: string;
    wifiName: string;
    wifiPassword: string;
    packageId: string;
    role: Role;
    customerId: string;
    dueDate: string; // ISO String
}

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}
