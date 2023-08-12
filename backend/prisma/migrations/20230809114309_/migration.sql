-- AlterTable
ALTER TABLE "inv_cardex" ALTER COLUMN "serial_no" DROP DEFAULT;
DROP SEQUENCE "inv_cardex_serial_no_seq";

-- AlterTable
ALTER TABLE "inv_purchase_order_detail" ALTER COLUMN "serial_no" DROP DEFAULT;
DROP SEQUENCE "inv_purchase_order_detail_serial_no_seq";
