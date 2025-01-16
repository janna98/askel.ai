-- CreateTable
CREATE TABLE "Employee"
(
    "id"                INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name"              TEXT     NOT NULL,
    "department"        TEXT     NOT NULL,
    "performanceReview" TEXT     NOT NULL,
    "createdAt"         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"         DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_name_key" ON "Employee" ("name");
