import cats.effect.{ IO, IOApp, Resource }
import fs2.{ Pipe, Stream }
import scala.concurrent.duration.*
import io.circe.syntax.*
import fs2.kafka.*

class Producer(server: String):

  private val topic = "lichess-games"

  private val producerSettings =
    ProducerSettings[IO, String, String]
      .withBootstrapServers(server)

  private val seedStream: Stream[cats.effect.IO, ProducerRecords[String, String]] =
    Stream
      .emit(ProducerRecords.one(ProducerRecord(topic, "g1", Game("1", "2", "3", true, "4").asJson.noSpaces)))
      .covary[IO]

  private val stream: Stream[cats.effect.IO, ProducerResult[String, String]] = seedStream
    .evalTap(IO.println)
    .through(KafkaProducer.pipe(producerSettings))

  def produce: Pipe[IO, Game, Int] =
    _.map(game => ProducerRecords.one(ProducerRecord(topic, game.id, game.asJson.noSpaces)))
      .through(KafkaProducer.pipe(producerSettings))
      .map(_.size)
