import sqlite3
import json
import urllib.parse

from websocket_server import WebsocketServer

# db
dbname = "chat.sqlite3"

def create_table():
    conn = sqlite3.connect(dbname)
    sql = '''
    CREATE TABLE IF NOT EXISTS message (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        NAME TEXT,
        MESSAGE TEXT
    );'''
    conn.execute(sql)
    conn.close()


def insert_message(name, message):
    conn = sqlite3.connect(dbname)
    sql = f"INSERT INTO message ( NAME, MESSAGE ) VALUES( '{urllib.parse.unquote(name)}', '{urllib.parse.unquote(message)}' )"
    conn.execute(sql)
    conn.commit()
    conn.close()


# websocket
def new_client(client, server):
    conn = sqlite3.connect(dbname)
    sql = "SELECT * FROM message"
    for row in conn.execute(sql):
        data = {'name': row[1], 'message': row[2]}
        server.send_message(client, json.dumps(data))
    conn.close()


def message_received(client, server, message):
    server.send_message_to_all(message)
    message = json.loads(message)
    insert_message(message['name'], message['message'])


create_table()
server = WebsocketServer(9001)
# 接続されたとき
server.set_fn_new_client(new_client)
# データが送られたとき
server.set_fn_message_received(message_received)
# 起動
server.run_forever()