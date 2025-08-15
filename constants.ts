
import { User, UserRole } from './types';

export const INITIAL_USERS: User[] = [
    { id: '1', username: 'A', password: '444', role: UserRole.ADMIN },
    { id: '2', username: 'H', password: '123', role: UserRole.USER },
];

export const DENOMINATIONS = [200, 100, 50, 20, 10, 5, 1, 0.5, 0.25];
