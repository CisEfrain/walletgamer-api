
// pasas un objeto como parametro, se remueven los que no tengan valor
const conditions = (params) => {
    return new Promise((resolve, reject) => {
        Object.keys(params).forEach((key) => (!params[key]) && delete params[key]);
        resolve(params)
    });
}

/*
* @params - params = json object
* @params - operator = sequelize operator
* @params - search = string
*/
const advancedConditions = (params, operator, search = null) => {
    return new Promise((resolve, reject) => {
        Object.keys(params).forEach((key, idx, array) => {
            console.log('parmas ', key)
            if (!params[key]) {
                delete params[key]
            } else {
                if (search && key.includes(search)) {
                    oldKey = key;
                    newKey = key.split(search)[0];
                    params[newKey] = { [operator]: params[oldKey] }
                    delete params[oldKey]
                } else {
                    params[key] = { [operator]: params[key] }
                }
            }
            if (idx === array.length - 1) {
                resolve(params)
            }
        });
    });
}
module.exports = {
    conditions,
    advancedConditions
}
