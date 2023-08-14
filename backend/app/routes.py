from itertools import chain
from app import app, driver
from flask import Response, request
from json import dumps
from .util import query, serialize_member

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/games', methods=['POST', 'GET'])
def getGames():
    records,_,_ = driver.execute_query(query("""
    MATCH (n:User)-[*3..4]-(m:User)
    RETURN m,n
    LIMIT $limit
    """), limit=request.args.get('limit', 100, type=int))
    a = [[serialize_member(val) for val in record] for record in records]
    return Response(dumps(a), mimetype='application/json')

@app.route('/api/path', methods=['POST'])
def getPath():
    users = request.form.get('username') if request.form.get('username') else 'jakconq, kifer35'
    user1, *user2 = users.split(',')
    user2 = user2[0].lstrip() if user2 and user2[0] else 'kifer35'
    records,_,_ = driver.execute_query(query("""
    MATCH p=shortestPath((n:User {name: $user1})-[r*1..20]->(m:User {name: $user2}))
    RETURN p LIMIT $limit
    """), limit=request.args.get('limit', 100, type=int), user1=user1, user2=user2)
    paths = [[{ 'start': relationship.start_node['name'], 'end': relationship.end_node['name'], 'type': relationship.type, 'id': relationship.element_id} for relationship in record.value('p')] for record in records]
    return Response(dumps(paths), mimetype='application/json')
@app.after_request
def add_cors(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response