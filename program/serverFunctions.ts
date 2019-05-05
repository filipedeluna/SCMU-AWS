import { 
  DBTables,
  selectAll,
  checkTableExists
} from './dbFunctions';

// General Functions
export const selectAllFromTable = (t, table : DBTables) => 
  checkTableExists(t, table)
  .then(val => {
    if (val)
      return selectAll(t, table);
    else
      return Promise.reject();
  })
