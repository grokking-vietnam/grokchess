from confluent_kafka import Consumer
from neo4j import GraphDatabase
from settings import Settings

cfg = Settings()

# Kafka consumer configuration
conf = {
    "bootstrap.servers": "your_kafka_bootstrap_servers",
    "group.id": "your_consumer_group_id",
    "auto.offset.reset": "earliest",
    "enable.auto.commit": False
}

# Neo4j database connection
uri = cfg.NEO4J_URI
username = cfg.NEO4J_USER
password = cfg.NEO4J_PASSWORD

# Kafka topic to consume from
topic = "grokchess"


def upsert_data_to_neo4j(tx, data):
    # Perform upsert logic with Neo4j
    # Modify this function to suit your specific upsert logic
    # Example:
    query = """
    MERGE (n:YourLabel {key: $key})
    SET n.value = $value
    """
    tx.run(query, key=data["key"], value=data["value"])


def consume_from_kafka():
    consumer = Consumer(conf)

    # Subscribe to the Kafka topic
    consumer.subscribe([topic])

    driver = GraphDatabase.driver(uri, auth=(username, password))

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
                    data = eval(message.value().decode("utf-8"))

                    session.write_transaction(upsert_data_to_neo4j, data)

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
