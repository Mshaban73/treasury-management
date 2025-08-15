
export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export interface User {
    id: string;
    username: string;
    password?: string; // Should not be stored in production, here for simulation
    role: UserRole;
}

export interface Transaction {
    id: string;
    date: string; // ISO string
    description: string;
    incoming: number;
    outgoing: number;
    notes: string;
}

export interface DenominationCount {
    denomination: number;
    count: number;
    total: number;
}

export interface DailyCount {
    id: string;
    date: string; // ISO string
    countedBy: string;
    denominations: DenominationCount[];
    countedTotal: number;
    systemBalance: number;
    difference: number;
    status: 'مطابق' | 'زيادة' | 'عجز';
}
