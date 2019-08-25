class ExecLogger {
  constructor() {
    this.startLogs = {};
    this.finishLogs = {};
  }

  start(name) {
    if(this.startLogs && this.startLogs[name]) {
      this.startLogs[name].push(new Error().stack);
    } else {
      this.startLogs = [name] = [new Error().stack];
    }
    
    console.log(`%c[START Logger]`, 'background: #2D343A; color: #89A1B3;');
    console.log(`Started at: ${new Date().toTimeString()}`);
    console.log(`[${name} module]`);
    console.warn(`${new Error().stack}`);
    console.log(`%c[START Logger]`, 'background: #2D343A; color: #89A1B3;');

  }

  finish(name) {    
    if(this.finishLogs && this.finishLogs[name]) {
      this.finishLogs[name].push(new Error().stack);
    } else {
      this.finishLogs = [name] = [new Error().stack];
    }

    console.log(`%c[FINISH Logger]`, 'background: #2D343A; color: #63B363;');
    console.log(`Finished at: ${new Date().toTimeString()}`);
    console.log(`[${name} module]`);
    console.warn(`${new Error().stack}`);
    console.log(`%c[FINISH Logger]`, 'background: #2D343A; color: #63B363;');
  }
}