FROM ubuntu:20.04

WORKDIR /app

RUN curl -sSLf https://virtuslab.github.io/scala-cli-packages/scala-setup.sh | sh

COPY Crawler.scala Crawler.scala

CMD ["scala-cli", "run", ".", "Crawler"]
