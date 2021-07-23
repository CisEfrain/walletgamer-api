const { responsesFormat } = require("../helpers");

const KEY = {
    "ae80dd38-5e20-11ea-bc55-0242ac130003" : "whatsapp", 
}

exports.validation = async (req, res, next) => {

    if (process.env.NODE_ENV === 'test') next()

    else {
        // eslint-disable-next-line no-prototype-builtins
        if (!req.headers["x-api-key"] || !KEY.hasOwnProperty(req.headers["x-api-key"])) {
            const resp = responsesFormat("UNAUTHORIZED")
            res.status(resp.status).json(resp)
        }
        else next()
    }
}

