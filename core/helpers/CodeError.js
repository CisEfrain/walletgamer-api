class CodeError extends Error {
    constructor(code, mensaje) {
     super(mensaje);
     this.codeE = code;
    }
  }

module.exports = CodeError