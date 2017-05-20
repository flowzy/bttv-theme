import { Debug } from './debug'

export class Mockups extends Debug {
    constructor () {
        super()

        this.mockups = {
            // example: require('../../templates/example.html')
        }
    }

    get (name = 'undefined') {
        return this.mockups[name] ? this.mockups[name] : this.error(`Mockups: "${name}" not found`)
    }
}