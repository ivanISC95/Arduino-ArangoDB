import asyncio
import requests
import aiohttp


from bottle import route, run, template


@route('/hello/<name>')
def index(name):
    return template('<b>Holaa prueba {{name}}</b>!', name=name)


@route('/saludos')
def saludos():
    return "saludos"



@route('/arango')
def arango():
    url = "http://localhost:8529/_db/_system/Estado/estado"
    response = requests.get(url)
    response.json()
    return response

@route('/main')
def main():
    async def main():
        async with aiohttp.ClientSession() as session:
            async with session.get('http://localhost:8529/_db/_system/Estado/estado') as resp:
                print(resp.status)                
                print(await resp.json())
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
    return ("Hecho")
    


run(host='localhost', port=8080)