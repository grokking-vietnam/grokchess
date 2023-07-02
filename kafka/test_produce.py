from confluent_kafka import Producer


# Kafka broker configuration
bootstrap_servers = 'localhost:29092'
topic = 'test_topic'

# Test message to be sent
message = 'Hello, Kafka!'


def produce_message():
    # Create Kafka producer
    producer = Producer({'bootstrap.servers': bootstrap_servers})

    # Produce message to Kafka topic
    producer.produce(topic, message.encode())

    producer.flush()

    # Close the producer
    producer.close()


if __name__ == '__main__':
    # Produce a message
    produce_message()
