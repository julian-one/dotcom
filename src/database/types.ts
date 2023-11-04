type UserRecord = {
  user_id: number;
  username: string;
  email: string;
  password: string;
  created_on: string;
  last_login?: string;
};

function isUserRecord(record: any): record is UserRecord {
  const hasUserId = typeof record.user_id === 'number';
  const hasUsername = typeof record.username === 'string';
  const hasEmail = typeof record.email === 'string';
  const hasPassword = typeof record.password === 'string';
  const hasCreatedOn = typeof record.created_on === 'string';
  const hasLastLogin =
    record.last_login === undefined || typeof record.last_login === 'string';
  return (
    hasUserId &&
    hasUsername &&
    hasEmail &&
    hasPassword &&
    hasCreatedOn &&
    hasLastLogin
  );
}

export { UserRecord, isUserRecord };
