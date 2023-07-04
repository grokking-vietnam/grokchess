from app import app, driver
from flask import Response, request
from json import dumps
from .util import query, serialize_member

@app.route('/')
@app.route('/index')
def index():
    return "Hello, World!"

@app.route('/games', methods=['POST', 'GET'])
def getGames():
    records,_,_ = driver.execute_query(query("""
    MATCH (n:User)-[*3..4]-(m:User)
    RETURN m,n
    LIMIT $limit
    """), limit=request.args.get('limit', 100, type=int))
    a = [[serialize_member(val) for val in record] for record in records]
    return Response(dumps(a), mimetype='application/json')

@app.after_request
def add_cors(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response