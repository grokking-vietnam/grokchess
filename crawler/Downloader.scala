import cats.syntax.all.*
import cats.effect.*
import fs2.*
import de.lhns.fs2.compress.ZstdDecompressor

import org.http4s.*
import org.http4s.implicits.*
import org.http4s.client.Client
import org.http4s.ember.client.EmberClientBuilder

import chess.{ Game as ChessGame, * }
import chess.MoveOrDrop.*
import chess.format.*
import chess.format.pgn.{ Move as PgnMove, * }

val uri       = uri"https://database.lichess.org/standard/lichess_db_standard_rated_2023-05.pgn.zst"
val total     = 100L
val minLength = 10

object Downloader:

  import Converter.*
  lazy val request = Request[IO](
    method = Method.GET,
    uri = uri
  )

  def download(client: Client[IO]) =
    client
      .stream(request)
      .switchMap(_.body)
      .through(Decompressor.decompress)
      .through(text.utf8.decode)
      .through(fs2.text.lines)
      .through(PgnDecoder.decode)
      // .evalTap(x => if x.isLeft then IO.println(x) else IO.unit)
      .collect:
        case Right(x) => x
      .map(_.toGame)
      .collect:
        case Some(x) => x
      .take(total)
    // .evalTap(IO.println)

object Converter:
  extension (c: Color) def asBoolean = c.fold(true, false)

  extension (pgn: ParsedPgn)
    def toGame: Option[Game] =
      for
        id         <- pgn.tags("Site").headOption
        playedAt   <- pgn.tags("Date")
        white      <- pgn.tags("White").headOption
        black      <- pgn.tags("Black").headOption
        totalMoves <- pgn.tree.map(_.size)
        winner     <- pgn.tags.outcome.map(_.winner).flatten
        if totalMoves >= minLength
      yield Game(
        id,
        white,
        black,
        winner.asBoolean,
        playedAt
      )

object Decompressor:
  val defaultChunkSize = 1024 * 4

  def decompress: Pipe[IO, Byte, Byte] =
    _.through(ZstdDecompressor[IO](defaultChunkSize).decompress)

object PgnDecoder:
  import chess.format.pgn.*

  val decodeToPgnStr: Pipe[IO, String, String] =
    def go(
        s: Stream[IO, String],
        p: Option[PartialPgnState]
    ): Pull[IO, String, Unit] =
      s.pull.uncons1.flatMap:
        case Some((line, tl)) =>
          p match
            case None =>
              if line.isEmpty then go(tl, None)
              else if line.isTag then go(tl, Some(Tags(line)))
              else
                Pull.raiseError[IO](
                  RuntimeException(s"Pgn has to start with tag $line")
                )
            case Some(partial) =>
              partial.take(line) match
                case Left(err) =>
                  Pull.raiseError(
                    RuntimeException(
                      s"Error parsing pgn: $err with state: $partial"
                    )
                  )
                case Right(next) =>
                  if next.isInstanceOf[Done] then Pull.output1(next.value) >> go(tl, None)
                  else go(tl, Some(next))
        case None => Pull.done

    in => go(in, None).stream

  val decode: Pipe[IO, String, Either[RuntimeException, ParsedPgn]] =
    _.through(decodeToPgnStr)
      .map(_.parse)

  sealed trait PartialPgnState:
    val value: String
    def take(line: String): Either[Throwable, PartialPgnState]

  case class Tags(value: String) extends PartialPgnState:
    def take(line: String) =
      if line.isTag then Tags(s"$value\n$line").asRight
      else if line.isEmpty then WatingForMoves(s"$value\n").asRight
      else RuntimeException(s"Invalid line: $line").asLeft

  case class WatingForMoves(value: String) extends PartialPgnState:
    def take(line: String) =
      Done(s"$value\n$line").asRight

  case class Done(value: String) extends PartialPgnState:
    def take(line: String) =
      RuntimeException(s"Invalid line: $line").asLeft

  extension (s: String)
    def isTag   = s.startsWith("[")
    def isMoves = s.startsWith("1")
    def parse   = Parser.full(PgnStr(s)).leftMap(x => RuntimeException(x.value))
