from flask import Flask
from neo4j import GraphDatabase, basic_auth
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
driver = GraphDatabase.driver(app.config['NEO4J_URI'], auth=basic_auth(app.config['NEO4J_USER'], app.config['NEO4J_PASSWORD']))

from app import routes