import {db} from "@/db";
import {Invoices} from "@/db/schema";
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


export default async function InvoicePage({params}: { params: { invoiceId: string } }) {
  const {userId} = await auth();
  if (!userId) return;

  const invoiceId = parseInt(params.invoiceId);

  if (isNaN(invoiceId)) {
    throw new Error('Invalid invoiceId');
  }

  const [result] = await db.select()
    .from(Invoices)
    .where(
      and(
        eq(Invoices.id, invoiceId),
        eq(Invoices.userId, userId),
      )
    )
    .limit(1)

  if (!result) {
    notFound()
  }

  return <Invoice invoice={result}/>
}