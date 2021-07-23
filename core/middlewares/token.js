/* eslint-disable no-unreachable */

const { responses } = require("../helpers");
const { servicioToken } = require('../services/')
const { jwt } = require("../dependences");
const { decode } = require("jsonwebtoken");
const CodeError = require("../helpers/CodeError");
const verificarToken = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const SECRET_PASS_JWT = servicioToken.SECRET_PASS_JWT

            const token = req.headers.authorization.split(" ")[1];
            // const decoded = jwt.verify(token, SECRET_PASS_JWT);

            jwt.verify(token, SECRET_PASS_JWT, function (err, decoded) {

                if (decoded){
                    req.jwt_data = decoded.data;
                    return next();
                }

                switch (err.name) {
                    case 'TokenExpiredError':
                        throw new CodeError("EXPIRED_TOKEN")
                        break;
                    case 'JsonWebTokenError':
                        throw new CodeError("TOKEN_INVALID")
                        break;
                    case 'NotBeforeError':
                        throw new CodeError("UNKNOWN")
                        break;
                    default:
                        throw new CodeError("UNKNOWN")
                }
            });

        } else {
            throw new CodeError("NO_TOKEN")
        }
    } catch (error) {
        console.log(error)
        res.json(responses.error(error))
    }
};
const esAdmin = (req,res,next) => {
    if(req.jwt_data && req.jwt_data.isAdmin){
      return next()
    }
    res.json(responses.error({code:'UNAUTHORIZED'}))
}

module.exports = {
    verificarToken,
    esAdmin
}