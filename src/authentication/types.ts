import { UserRecord, isUserRecord } from '../database/types'

type User = {
    id: number;
    username: string;
    email: string;
    password: string;
    createdOn: string;
    lastLogin?: string;
}

const toUser = (record: UserRecord): User => {
    if (!isUserRecord(record)) {
        throw new Error('The provided record is not a UserRecord type');
    }
    return {
        id: record.user_id,
        username: record.username,
        email: record.email,
        password: record.password,
        createdOn: record.created_on,
        lastLogin: record.last_login
    }
}

export { User, toUser}


