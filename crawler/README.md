# Crawler

Streaming games from [Lichess Database](https://database.lichess.org)

## Run

Install [scala-cli](https://scala-cli.virtuslab.org/install)

    source .env && scala-cli run . --main-class Crawler

Test Kafka

    scala-cli run . --main-class Ping

Build Docker image

``` bash
bash build_image.sh
```
