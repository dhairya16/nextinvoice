import {pgTable, pgEnum, serial, timestamp, integer, text} from "drizzle-orm/pg-core";
import {AVAILABLE_STATUSES} from "@/data/invoices";

export type Status = typeof AVAILABLE_STATUSES[number]["id"];

const statuses: string[] = AVAILABLE_STATUSES.map((s) => s.id) as Array<Status>;

export const statusEnum = pgEnum('status', statuses as [Status, ...Array<Status>]);

export const Invoices = pgTable('invoices', {
  id: serial("id").primaryKey().notNull(),
  createTs: timestamp("createTs").defaultNow().notNull(),
  value: integer("value").notNull(),
  description: text("description").notNull(),
  userId: text("userId").notNull(),
  status: statusEnum('status').notNull(),
})