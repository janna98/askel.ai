-- CreateTable
CREATE TABLE "Embedding"
(
    "id"         INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "embeddings" TEXT    NOT NULL,
    CONSTRAINT "Embedding_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Embedding_employeeId_key" ON "Embedding" ("employeeId");
