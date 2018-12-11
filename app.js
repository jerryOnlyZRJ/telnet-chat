const net = require('net')
// 记录用户数
let count = 0

const server = net.createServer(socket => {
    socket.setEncoding('utf8')
    socket.write(`
        \n > Welcome to node-chat!
        \n > ${count} other people are connected at this time.
        \n > please input your name and press enter:
    `)
    count++
    socket.on('data', data => {
        console.log(data)
    })
    socket.on('close', () => {
        count--
    })
})

server.listen(3000, () => {
    console.log('server is listening at port 3000')
})