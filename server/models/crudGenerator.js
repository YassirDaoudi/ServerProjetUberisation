const { update, query } = require("./queries")

/**
 * 
 * @param {Object} objectType takes an object of the form {tableName: ,columns: [] }
 * @returns 
 */
const generator = (objectType)=>{
    /**
     * 
     * @param {any[]} values array of values to insert
     * @param {any[]} columns choose which columns to use (optionnaal if you dont specify it will use all columns in db order)
     */
    const insert = (values,columns)=>{
        let usedCols = objectType.columns;
        if (columns != undefined) {
            usedCols = columns
        }
        let sql = "INSERT INTO "+objectType.tableName+"("+usedCols.join(',')+") VALUES ("+values.map((_,index)=>"$"+(index+1))+");"
        return update(sql,values)
        .then(bool=>bool)
    }

    /**
     * 
     * @param {any[]} values THE LAST ELEMENT SHOULD BE THE ID OF THE ROW TO BE UPDATED !!
     * @param {any[]} columns array of columns to be updated
     * @returns 
     */
    const updateById = (values,columns)=>{
        let usedCols = objectType.columns;
        if (columns != undefined) {
            usedCols = columns
        }

        let i = 1
        let sql = "UPDATE "+objectType.tableName+" SET "+usedCols.map((col,index)=>{i=index+1 ;return col+"=$"+(index+1)}).join(',')+" WHERE id=$"+(i+1)+";"
        return update(sql,values)
        .then(bool=>bool)
    }

    /**
     * 
     * @param {number} id 
     * @returns 
     */
    const deleteById =(id)=>{
        let sql = "DELETE FROM "+objectType.tableName+" WHERE id=$1;"
        return update(sql,[id])
        .then(bool=>bool)
    }

    const getAll = (columns)=>{
        let usedCols;
        if (columns != undefined) {
            usedCols = columns.join(",")
        }else{
            usedCols ="*"
        }
        let sql = "SELECT "+usedCols+" FROM "+objectType.tableName+";"
        return query(sql)
        .then(res=>{ return res})
    }
    return {insert,updateById,deleteById,getAll}
}
module.exports = {generator}