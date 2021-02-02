window.addEventListener('DOMContentLoaded', () => {
    const name = document.getElementById("name")
    const message = document.getElementById("input")
    const sendBtn = document.getElementById("send")
    const msgBox = document.getElementById("chat")

    out = message => {
        const p = document.createElement('p')
        p.textContent = message
        msgBox.prepend(p)
    }

    sendBtn.addEventListener('click', () => {
        ws.send(JSON.stringify(
            {
                "name": encodeURI(name.value),
                "message": encodeURI(message.value)
            }
        ))
        
        message.value = ''
    })

    // websocketコネクション
    let ws = new WebSocket('ws://' + location.hostname + ':9001/')

    // ハンドラを定義する
    // 接続したとき
    ws.onopen = function () {
        out('Joined')
    }

    // サーバから受信したとき
    ws.onmessage = function (e) {
        //JSON文字列が返ってくるのでオブジェクトに変換
        let message = JSON.parse(e.data)
        let ms = decodeURI(message['name'] + ' >>> ' + message['message'])
        out(ms)
    }

    // サーバから通信が途絶えたとき
    ws.onerror = function () {
        out('Server Error')
    }
})