type UserRecord = {
  user_id: number;
  username: string;
  email: string;
  password: string;
  created_on: Date; 
  last_login: Date | null;
};

function isUserRecord(record: any): record is UserRecord {
  const hasUserId = typeof record.user_id === 'number';
  const hasUsername = typeof record.username === 'string';
  const hasEmail = typeof record.email === 'string';
  const hasPassword = typeof record.password === 'string';
  const hasCreatedOn = record.created_on instanceof Date;
  const hasLastLogin = record.last_login === null || record.last_login instanceof Date;

  console.log(typeof record.created_on);
  console.log(
"1", hasUserId,
"2", hasUsername,
"3", hasEmail,
"4", hasPassword,
"5", hasCreatedOn,
"6", hasLastLogin)
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
