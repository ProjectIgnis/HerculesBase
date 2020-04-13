CREATE TABLE IF NOT EXISTS "responses" (
    "os"    TEXT COLLATE NOCASE,
    "major" INTEGER,
    "minor" INTEGER,
    "patch" INTEGER,
    "json" TEXT NOT NULL,
    PRIMARY KEY ("os", "major", "minor", "patch")
);
