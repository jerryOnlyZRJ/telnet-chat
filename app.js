const net = require('net')
// 记录用户数
let count = 0,
    users = {}

const server = net.createServer(socket => {
    socket.setEncoding('utf8')
    socket.write(`\n > Welcome to node-chat!
        \n > ${count} other people are connected at this time.
        \n > please input your name and press enter: `)
    count++
    let nickname = null
    socket.on('data', data => {
        data = data.replace('\r\n', '')
        if (!nickname) {
            // 保证接收到的第一份data是nickname
            if (users[data]) {
                socket.write('\033[93m > Nickname already in use.Try again:\033[39m  ')
                return
            } else {
                nickname = data
                users[nickname] = socket
                // 广播新增用户的消息
                if (JSON.stringify(users) !== '{}') {
                    Object.values(users).map(item => {
                        item.write('\033[90m > ' + nickname + ' joined the room, welcome!\033[39m\n')
                    })
                }
            }
        } else {
            // 第二次之后接收到的data视为消息
            // 广播消息（区分自己和其他用户）
            if (JSON.stringify(users) !== '{}') {
                Object.keys(users).map(name => {
                    if (name != nickname) {
                        // 他人
                        users[name].write('\033[96m > ' + nickname + ':\033[39m  ' + data + '\n')
                    }
                })
            }
        }
    })

    socket.on('close', () => {
        // 使用ctrl + ] 进入telnet命令行后输入quit命令断开链接
        count--
        delete users[nickname]
        if (JSON.stringify(users) !== '{}') {
            Object.values(users).map(item => {
                item.write('\033[90m > ' + nickname + ' left this room.\033[39m\n')
            })
        }
    })
})

server.listen(3000, () => {
    console.log('server is listening at port 3000')
})