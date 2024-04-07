import EventEmitter from 'eventemitter3'

const emitter = new EventEmitter()
let userName

emitter.on('getUserName', (data) => {
    userName = data
})

export { emitter, userName }
