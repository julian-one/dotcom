const init = () => {
  process.env.PORT = '8000';
  process.env.SESSION_SECRET = 'your_test_session_secret';
  process.env.IS_COOKIE_SECURE = 'false';
  process.env.ALLOWED_EMAILS = 'test1@example.com,test2@example.com';
  process.env.DB_USER = 'your_test_db_user';
  process.env.DB_HOST = 'localhost';
  process.env.DB_NAME = 'your_test_db_name';
  process.env.DB_PASSWORD = 'your_test_db_password';
  process.env.DB_PORT = '5432';
};

init();
