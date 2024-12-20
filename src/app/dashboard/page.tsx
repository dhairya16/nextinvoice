import {CirclePlus} from "lucide-react";
import {auth} from "@clerk/nextjs/server";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button";
import Link from "next/link";

import {db} from "@/db";
import {Customers, Invoices} from "@/db/schema";
import {cn} from "@/lib/utils";
import Container from "@/components/Container";
import {eq} from "drizzle-orm";

export default async function Home() {
  const {userId} = await auth();

  if (!userId) return;

  const results = await db.select()
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(eq(Invoices.userId, userId));
  // console.log('results =>', results)

  const invoices = results.map(({invoices, customers}) => {
    return {
      ...invoices,
      customer: customers,
    }
  });

  return (
    <main className="h-full">
      <Container>
        <div className="flex justify-between mb-6">
          <h1 className="text-5xl font-bold">
            Invoices
          </h1>
          <p>
            <Button className="inline-flex gap-2" variant="ghost" asChild>
              <Link href="/invoices/new">
                <CirclePlus className="h-4 w-4"/>
                Create Invoice
              </Link>
            </Button>
          </p>
        </div>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] p-3">
                Date
              </TableHead>
              <TableHead className="p-3">
                Customer
              </TableHead>
              <TableHead className="p-3">
                Email
              </TableHead>
              <TableHead className="text-center p-3">
                Status</TableHead>
              <TableHead className="text-right p-3">
                Value
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((result) => (
              <TableRow key={result.id}>
                <TableCell className="text-left font-medium p-0">
                  <Link href={`invoices/${result.id}`} className="font-semibold p-3 block">
                    {new Date(result.createTs).toLocaleDateString()}
                  </Link>
                </TableCell>
                <TableCell className="text-left p-0">
                  <Link href={`invoices/${result.id}`} className="font-semibold p-3 block">
                    {result.customer.name}
                  </Link>
                </TableCell>
                <TableCell className="text-left p-0">
                  <Link href={`invoices/${result.id}`} className="p-3 block">
                    {result.customer.email}
                  </Link>
                </TableCell>
                <TableCell className="text-center p-0">
                  <Link href={`invoices/${result.id}`} className="p-3 block">
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
                  </Link>
                </TableCell>
                <TableCell className="text-right p-0">
                  <Link href={`invoices/${result.id}`} className="font-semibold p-3 block">
                    ${(result.value / 100).toFixed(2)}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </main>
  );
}