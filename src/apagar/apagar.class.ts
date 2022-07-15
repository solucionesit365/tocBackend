
const exec = require('child_process').exec;
const os = require('os');
export class Apagar {
     
     apagarEquipo() {
      if(os.platform() === 'linux') {
       exec("sudo -s shutdown now")
      }else {
        exec("shutdown /p")
      }
    }
     
}

 export const apagarinstance = new Apagar();

