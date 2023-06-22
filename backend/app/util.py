from textwrap import dedent
from typing import cast
from typing_extensions import LiteralString

def query(q: LiteralString) -> LiteralString:
    # this is a safe transform:
    # no way for cypher injection by trimming whitespace
    # hence, we can safely cast to LiteralString
    return cast(LiteralString, dedent(q).strip())

def serialize_member(member):
    return {
        "name": member.get("name")
    }