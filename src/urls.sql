CREATE TABLE IF NOT EXISTS "urls" (
    "id"    INTEGER PRIMARY KEY AUTOINCREMENT,
    "url"   TEXT,
    "os"    TEXT COLLATE NOCASE,
    "major" INTEGER,
    "minor" INTEGER,
    "patch" INTEGER,
    "hash"  VARCHAR(255),
    "date"  TEXT
);
