const { pool } = require("./pg");

/**
 * 
 * @param {string} sql 
 * @param {any[]} params 
 * @returns {Promise<false | any[]>}
 */
const query = (sql, params) => {
  return pool.query(sql, params).then((result) => {
    if (result.rowCount == 0) {
      return false;
    } else {
      return result.rows;
    }
  });
};

/**
 * 
 * @param {string} sql 
 * @param {any[]} params 
 * @returns 
 */
const update =(sql,params)=>{
    return pool.query(sql, params).then((result) => {
        if (result.rowCount == 0) {
          return false;
        } else {
          return true;
        }
      });
}
module.exports ={update,query}