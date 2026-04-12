-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceNumber" TEXT NOT NULL,
    "totalAmount" REAL NOT NULL,
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "dueDate" DATETIME,
    "notes" TEXT,
    "vendorOrderId" TEXT NOT NULL,
    CONSTRAINT "Invoice_vendorOrderId_fkey" FOREIGN KEY ("vendorOrderId") REFERENCES "VendorOrder" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Invoice" ("dueDate", "id", "invoiceNumber", "issuedAt", "notes", "totalAmount", "vendorOrderId") SELECT "dueDate", "id", "invoiceNumber", "issuedAt", "notes", "totalAmount", "vendorOrderId" FROM "Invoice";
DROP TABLE "Invoice";
ALTER TABLE "new_Invoice" RENAME TO "Invoice";
CREATE UNIQUE INDEX "Invoice_vendorOrderId_key" ON "Invoice"("vendorOrderId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
