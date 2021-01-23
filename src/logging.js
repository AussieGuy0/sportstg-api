const debug = require('debug')


const createLogger = (name) => {
    const debugLogger = debug(name)
    return {
        debug: (message) => debugLogger(message)
    }
    
}

module.exports = createLogger
