from confluent_kafka import Consumer

# Kafka broker configuration
bootstrap_servers = 'localhost:29092'
topic = 'test_topic'

# Test message to be sent
message = 'Hello, Kafka!'


def consume_message():
    # Create Kafka consumer
    consumer = Consumer({
        'bootstrap.servers': bootstrap_servers,
        'group.id': 'test_consumer_group',
        'auto.offset.reset': 'earliest'
    })

    # Subscribe to Kafka topic
    consumer.subscribe([topic])

    # Consume messages
    while True:
        msg = consumer.poll(1.0)
        if msg is None:
            continue
        if msg.error():
            print(f'Consumer error: {msg.error()}')
            continue

        # Print received message
        print(f'Received message: {msg.value().decode()}')
        break

    # Close the consumer
    consumer.close()


if __name__ == '__main__':
    # Produce a message
    # produce_message()

    # Consume the message
    consume_message()
