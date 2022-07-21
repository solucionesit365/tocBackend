"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalInstance = exports.GlobalClase = void 0;
class GlobalClase {
    getStopNecesario() {
        return this.stopNecesario;
    }
    setStopNecesario(valor) {
        this.stopNecesario = valor;
    }
}
exports.GlobalClase = GlobalClase;
exports.globalInstance = new GlobalClase();
//# sourceMappingURL=global.clase.js.map