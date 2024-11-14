import {db} from "@/db";
import {Invoices, Customers} from "@/db/schema";
import {and, eq} from "drizzle-orm";
// import {Badge} from "@/components/ui/badge";
// import {cn} from "@/lib/utils";
import {notFound} from "next/navigation";
import {auth} from "@clerk/nextjs/server";
// import Container from "@/components/Container";
//
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {Button} from "@/components/ui/button";
// import {AVAILABLE_STATUSES} from "@/data/invoices";
// import {updateStatusAction} from "@/app/actions";
// import {ChevronDown} from "lucide-react";
import Invoice from "@/app/invoices/[invoiceId]/Invoice";

type Params = Promise<{ invoiceId: string }>;

export default async function InvoicePage({params}: { params: Params }) {
  const {userId} = await auth();
  if (!userId) return;

  const {invoiceId} = await params;

  const id = parseInt(invoiceId);

  if (isNaN(id)) {
    throw new Error('Invalid invoiceId');
  }

  const [result] = await db.select()
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(
      and(
        eq(Invoices.id, id),
        eq(Invoices.userId, userId),
      )
    )
    .limit(1)

  if (!result) {
    notFound()
  }

  const invoice = {
    ...result.invoices,
    customer: result.customers,
  }

  return <Invoice invoice={invoice}/>
}