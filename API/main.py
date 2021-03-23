from sanic import Sanic
from sanic import response
from sanic.response import json
from pyArango.connection import *
import json
import asyncio
import requests
import aiohttp
app = Sanic("Hola Mundo!")

# URL LOCAL : http://localhost:8529/_db/_system/Estado/estado
# URL SERVIDOR : https://arango.conoce360.tech 

# VARIABLES DE CONEXIÓN CON ARANGODB!
con = Connection(arangoURL="https://arango.conoce360.tech", username="root",password="conoce360")
bd = con["_system"]


# METODO GET
@app.route('/obtenerData', methods=['GET'])
async def estado(request):
    aql = 'For g1 in Estado_Estado return g1'
    queryResult = bd.AQLQuery(aql, rawResults = True, batchSize = 100)
    result = [r1 for r1 in queryResult]
    print("ECHO!")
    return response.json(result)



# METODO POST
@app.route('/Estado', methods=['POST'])
async def echo(request):
    if request.json:
        resp=(request.json)
        resp2 = {"estado":resp}
        aql = "INSERT {@resp2} INTO Estado_Estado"
        queryResult = bd.AQLQuery(aql, bindVars=resp2)
        return json(request.json)
    return json({"RESP":"ERROR"})

if __name__ == '__main__':
    app.run()