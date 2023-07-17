package grok

import cats.effect.{ IO, IOApp, Resource }
import fs2.{ Pipe, Stream }
import scala.concurrent.duration.*
import io.circe.syntax.*
import fs2.kafka.*

object Producer extends IOApp.Simple:

  val server = "http://localhost:9094"
  val topic  = "lichess-games1"

  val producerSettings =
    ProducerSettings[IO, String, String]
      .withBootstrapServers(server)

  val seedStream: Stream[cats.effect.IO, ProducerRecords[String, String]] =
    Stream
      .emit(ProducerRecords.one(ProducerRecord(topic, "g1", Game("1", "2", "3", true, "4").asJson.noSpaces)))
      .covary[IO]

  val stream = seedStream
    .evalTap(IO.println)
    .through(KafkaProducer.pipe(producerSettings))

  IO.println("hello kafka") >> stream.compile.drain

  def run: IO[Unit] = IO.println("hello kafka") >> stream.compile.drain
