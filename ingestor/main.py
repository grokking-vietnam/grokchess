import json

from confluent_kafka import Consumer
from neo4j import GraphDatabase
from settings import Settings

cfg = Settings()


# Neo4j database connection
uri = cfg.NEO4J_URI
username = cfg.NEO4J_USER
password = cfg.NEO4J_PASSWORD

# Kafka topic to consume from
topic = "lichess-games"

# MERGE (m:User { name: "$loser" })
upsert_query = """
MERGE (n:User {name: $winner})
MERGE (m:User {name: $loser})
WITH n, m
MERGE (n)-[r:WON]->(m)
SET r.white = $white, r.black = $black
RETURN r
"""


def upsert_data_to_neo4j(tx, data):
    # Perform upsert logic with Neo4j
    # Modify this function to suit your specific upsert logic

    if data["winner"]:
        data["winner"] = data["white"]
        data["loser"] = data["black"]
    else:
        data["winner"] = data["black"]
        data["loser"] = data["white"]

    tx.run(upsert_query, **data)
    print(f"Upserted data: {data['winner']} won against {data['loser']}")


def consume_from_kafka():
    consumer = Consumer({
        "bootstrap.servers": cfg.KAFKA_BOOTSTRAP_SERVERS,
        "group.id": "test_consumer_group",
        "auto.offset.reset": "earliest",
        "enable.auto.commit": False
    })

    # Subscribe to the Kafka topic
    consumer.subscribe([topic])

    driver = GraphDatabase.driver(uri, auth=(username, password))
    driver.verify_authentication()

    try:
        with driver.session() as session:
            while True:
                # Poll for Kafka messages
                message = consumer.poll(1.0)

                if message is None:
                    continue
                if message.error():
                    print(f"Consumer error: {message.error()}")
                    continue

                # Process the Kafka message
                try:
                    data = json.loads(message.value().decode())

                    if data["winner"]:
                        data["winner"] = data["white"]
                        data["loser"] = data["black"]
                    else:
                        data["winner"] = data["black"]
                        data["loser"] = data["white"]

                    session.run(upsert_query, **data)

                except Exception as e:
                    print(f"Error processing message: {e}")

                # Commit the Kafka offset
                consumer.commit()

    except KeyboardInterrupt:
        pass

    finally:
        # Close the Kafka consumer and Neo4j driver
        consumer.close()
        driver.close()


if __name__ == "__main__":
    consume_from_kafka()
