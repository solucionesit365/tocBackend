"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apagarinstance = exports.Apagar = void 0;
const exec = require('child_process').exec;
const os = require('os');
class Apagar {
    apagarEquipo() {
        if (os.platform() === 'linux') {
            exec("sudo -s shutdown now");
        }
        else {
            exec("shutdown /p");
        }
    }
}
exports.Apagar = Apagar;
exports.apagarinstance = new Apagar();
//# sourceMappingURL=apagar.class.js.map