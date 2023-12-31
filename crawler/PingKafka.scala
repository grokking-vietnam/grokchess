import cats.effect.{ IO, IOApp }
import fs2.kafka.*
import scala.concurrent.duration.*
import fs2.{ Pipe, Stream }

object Ping extends IOApp.Simple:

  val server = "localhost:9094"
  val topic  = "test-topic"

  val consumerSettings =
    ConsumerSettings[IO, String, String]
      .withAutoOffsetReset(AutoOffsetReset.Earliest)
      .withBootstrapServers(server)
      .withGroupId("group")

  val producerSettings =
    ProducerSettings[IO, String, String]
      .withBootstrapServers(server)

  def run: IO[Unit] =

    val seedStream: Stream[cats.effect.IO, ProducerRecords[String, String]] =
      Stream
        .emit(ProducerRecords.one(ProducerRecord(topic, "ping", "pong")))
        .covary[IO]

    val consumerStream: Stream[cats.effect.IO, ProducerRecords[String, String]] =
      KafkaConsumer
        .stream(consumerSettings)
        .subscribeTo(topic)
        .records
        .map: committable =>
          val key    = committable.record.key
          val value  = committable.record.value
          val record = ProducerRecord(topic, key, value)
          ProducerRecords.one(record)

    val stream = (seedStream ++ consumerStream)
      .delayBy(1.second)
      .evalTap(IO.println)
      .through(KafkaProducer.pipe(producerSettings))

    IO.println("hello kafka") >> stream.compile.drain
