CREATE TABLE IF NOT EXISTS "urls" (
    "id"    INTEGER PRIMARY KEY AUTOINCREMENT,
    "url"   TEXT NOT NULL,
    "os"    TEXT NOT NULL COLLATE NOCASE,
    "major" INTEGER NOT NULL,
    "minor" INTEGER NOT NULL,
    "patch" INTEGER NOT NULL,
    "hash"  VARCHAR(255) NOT NULL,
    "date"  TEXT NOT NULL
);
