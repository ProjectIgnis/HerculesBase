CREATE TABLE IF NOT EXISTS "urls" (
    "id"    INTEGER PRIMARY KEY AUTOINCREMENT,
    "url"   TEXT,
    "major" INTEGER,
    "minor" INTEGER,
    "patch" INTEGER,
    "hash"  VARCHAR(255),
    "date"  TEXT
);
