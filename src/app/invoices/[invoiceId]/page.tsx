import {db} from "@/db";
import {Invoices} from "@/db/schema";
import {and, eq} from "drizzle-orm";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {notFound} from "next/navigation";
import {auth} from "@clerk/nextjs/server";

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

  return (
    <main className="w-full h-full max-w-5xl mx-auto my-12">
      <div className="flex justify-between mb-8">
        <h1 className="flex items-center gap-4 text-3xl font-semibold">
          Invoice {invoiceId}
          <Badge
            className={cn(
              "rounded-full capitalize",
              result.status === "open" && "bg-blue-500",
              result.status === "paid" && "bg-green-600",
              result.status === "void" && "bg-zinc-700",
              result.status === "uncollectible" && "bg-red-600",
            )}
          >
            {result.status}
          </Badge>
        </h1>
      </div>

      <p className="text-3xl mb-3">${(result.value / 100).toFixed(2)}</p>

      <p className="text-lg mb-8">{result.description}</p>

      <h2 className="font-bold text-lg mb-4">Billing Details</h2>

      <ul className="grid gap-2">
        <li className="flex gap-4">
          <strong className="block w-28 flex-shrink-0 font-medium text-sm">
            Invoice ID
          </strong>
          <span>{result.id}</span>
        </li>
        <li className="flex gap-4">
          <strong className="block w-28 flex-shrink-0 font-medium text-sm">
            Invoice Date
          </strong>
          <span>{new Date(result.createTs).toLocaleDateString()}</span>
        </li>
        <li className="flex gap-4">
          <strong className="block w-28 flex-shrink-0 font-medium text-sm">
            Billing Name
          </strong>
          {/*<span>{result.customer.name}</span>*/}
        </li>
        <li className="flex gap-4">
          <strong className="block w-28 flex-shrink-0 font-medium text-sm">
            Billing Email
          </strong>
          {/*<span>{result.customer.email}</span>*/}
        </li>
      </ul>
    </main>
  );
}