from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    NEO4J_URI: str = "bolt://lab.grokking.org:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "password"
    KAFKA_BOOTSTRAP_SERVERS: str = "localhost:9094"
