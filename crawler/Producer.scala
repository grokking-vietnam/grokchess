import cats.effect.{ IO, IOApp }
import fs2.kafka.*
import scala.concurrent.duration.*
import fs2.{ Pipe, Stream }

object Producer:

  val server = "localhost:9094"
  val topic = "lichess-games"

  val producerSettings =
    ProducerSettings[IO, String, String]
      .withBootstrapServers(server)

  def run: IO[Unit] =
    val seedStream: Stream[cats.effect.IO, ProducerRecords[String, String]] =
      Stream
        .emit(ProducerRecords.one(ProducerRecord(topic, "ping", "pong")))
        .covary[IO]

    val stream = seedStream
      .delayBy(1.second)
      .evalTap(IO.println)
      .through(KafkaProducer.pipe(producerSettings))

    IO.println("hello kafka") >> stream.compile.drain
