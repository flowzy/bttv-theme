export class Debug {
    constructor () {
        this.__prefix = '[BetterTTV]';
    }
    log (input) {
        console.log(this.__prefix, input);
    }
    error (input) {
        console.error(this.__prefix, input);
    }
    warn (input) {
        console.warn(this.__prefix, input);
    }
}