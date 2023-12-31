import io.circe.Codec
import io.circe.generic.auto.*

case class Game(
    id: String,
    white: String,
    black: String,
    winner: Boolean, // true => white, false => black
    playedAt: String
) derives Codec.AsObject
