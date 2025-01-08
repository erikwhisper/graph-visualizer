# graph-visualizer

This is the initial commit, miau!
-> (06.12.2024) Initial index.html layout for PAG input values: Matrix, JSON-Data, DOT-Syntax (including css)

Oopsie!
-> (08.01.2025) Here's the way Admg Matrices get turned into a Json Object link.

Mapping Json -> (Admg) Matrix:

Keine Kanten:
"", "A", "B"
"A", 0, 0
"B", 0, 0
----------
Directed Edge A -> B [1 edge between two nodes]:
"", "A", "B"
"A", 0, 1
"B", 0, 0

json: arrowhead: normal arrowtail: tail
----------
Directed Edge B -> A [1 edge between two nodes]:
"", "A", "B"
"A", 0, 0
"B", 1, 0

json: arrowhead: tail arrowtail: normal
----------
Bi-Directed Edge A <-> B (only a Bi-Directed edge, so the same as B <-> A) [1 edge between two nodes]:
"", "A", "B"
"A", 0, 2
"B", 2, 0

json: arrowhead: normal arrowtail: normal isDashed: true
----------
Bi-Directed Edge B <-> A (only a Bi-Directed edge, so the same as B <-> A) [1 edge between two nodes]:
"", "A", "B"
"A", 0, 2
"B", 2, 0

json: arrowhead: normal arrowtail: normal isDashed: true

This means: A <-> B is the same as B <-> A.
----------
Bi-Directed A <-> B + Directed Edge A -> B [2 edges between two nodes]:
"", "A", "B"
"A", 0, 1
"B", 2, 0

json:
Edge 1: arrowhead: normal arrowtail: normal isDashed: true
Edge 2: arrowhead: normal arrowtail: tail
----------
Bi-Directed A <-> B + Directed Edge B -> A [2 edges between two nodes]:
"", "A", "B"
"A", 0, 2
"B", 1, 0

Edge 1: arrowhead: normal arrowtail: normal isDashed: true
Edge 2: arrowhead: tail arrowtail: nornmal

------------------------------------------------------------------
Mapping Json -> (Admg) Matrix:

Zwei mal über alle Edges iterieren.

Erst alle Bi-Directed Edges in die Matrix eintragen, so das überall eine 2 ist wo eine sein muss
und dann die Directed Edges da ergänzen wo sie hin müssen, das heißt aus 0 0 kann 1 0 oder 0 1 werden
oder falls es schon eine bidrected kante zwischen den beiden knoten gibt kann aus 2 2 ein 1 2 oder 2 1 werden.

In der jsonData sind bi-directed edges die die arrowhead=normal und arrowtail=normal haben und zusätzlich isDashed = true,
directed edges sind die die A->B: arrowhead=normal und arrowtail=tail ODER B->A: arrowhead=tail und arrowhead=normal haben

durch zweifaches iterieren spart man sich überprüfen ob man schon irgendwas in die matrix geschrieben hat und kann so
einf mit den directed edges den aktuellen stand mit nur bidirected edges durch überschreiben ergänzen.
