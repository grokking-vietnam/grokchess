# Grokchess

This small project is a proof of concept of [Neo4j](https://neo4j.com/). We clone and extend functionality of [freopen.org](https://lichess.org/@/freopen/blog/carlsen-number-for-every-lichess-user/DzjHeprV) by adding ability to find shortest path between 2 any players.

### Detail of project:
- Pulling match data from Lichess's database. Right now we pull 1 month data which is approximate 60M games.
- Streaming match data to Neo4J
- UI to display the path between 2 players

### Demo:
[Link to project](http://neo4j-demo.lab.grokking.org/)  
Enter user ID of 2 Lichess players (separate by comma). Or you can leave input empty and press enter.

![sample](https://cdn.discordapp.com/attachments/1120412662564667544/1142449560254435549/image.png)
### Tech stack:
- Frontend: React Typescript
- Backend (API): Flask
- Crawler: Scala
- Realtime ingestor: Python
- Infrastructure: Docker, Kafka, Neo4j
