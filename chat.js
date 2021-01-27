window.addEventListener('DOMContentLoaded', () => {
    const name = document.getElementById("name")
    const input = document.getElementById("input")
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
                "name": name.value,
                "message": input.value
            }
        ))
        
        input.value = ''
    })

    // websocketコネクション
    let ws = new WebSocket('ws://18.188.218.88:9001/')

    // ハンドラを定義する
    // 接続したとき
    ws.onopen = function () {
        out('Joined')
    }

    // サーバから受信したとき
    ws.onmessage = function (e) {
        //JSON文字列が返ってくるのでオブジェクトに変換
        let message = JSON.parse(e.data)
        out(message['name'] + ' >>> ' + message['message'])
    }

    // 通信を閉じたとき
    ws.onclose = function () {
        out('Leave')
    }

    // サーバから通信が途絶えたとき
    ws.onerror = function () {
        out('Error')
    }
})