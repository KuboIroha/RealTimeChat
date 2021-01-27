import os
import json

from websocket_server import WebsocketServer


def new_client(client, server):
    #ToDo DBからデータを取得、送信する
    pass
    

def message_received(client, server, message):
    server.send_message_to_all(message)
    #ToDo DBにデータを保存する


server = WebsocketServer(9001)
server.set_fn_new_client(new_client)
server.set_fn_message_received(message_received)
server.run_forever()