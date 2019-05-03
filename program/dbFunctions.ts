export const checkTableExists = (t) =>
  t.one("SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'users')")
  .then(val => val.exists)



export const getAllUsers = (t) =>
  t.any("SELECT * FROM users")
