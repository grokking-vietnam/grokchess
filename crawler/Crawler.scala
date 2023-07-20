import cats.syntax.all.*
import cats.effect.*
import fs2.*

import org.http4s.client.Client
import org.http4s.ember.client.EmberClientBuilder

object Crawler extends IOApp.Simple:

  def execute(client: Client[IO]) =
    Downloader
      .download(client)
      .through(Producer.produce)
      .compile
      .drain

  val run: IO[Unit] = EmberClientBuilder
    .default[IO]
    .build
    .use(execute)
