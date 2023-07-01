from pydantic import BaseSettings


class Settings(BaseSettings):
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = ""
    NEO4J_PASSWORD: str = ""
