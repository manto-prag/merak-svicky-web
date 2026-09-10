import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/i18n";
import { listOrders, updateOrderStatus } from "@/lib/orders.functions";
import { colorsQuery, packagingsQuery, scentsQuery } from "@/lib/catalog";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Administrace — MERAK svíčky" },
      { name: "description", content: "Správa objednávek a skladu MERAK svíčky." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Administrace — MERAK svíčky" },
      { property: "og:description", content: "Interní správa obchodu." },
      { property: "og:url", content: "/admin" },
    ],
    links: [{ rel: "canonical", href: "/admin" }],
  }),
  component: AdminPage,
});

type OrderRow = Awaited<ReturnType<typeof listOrders>>[number];

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchOrders = useServerFn(listOrders);
  const setStatus = useServerFn(updateOrderStatus);

  const ordersQuery = useQuery({ queryKey: ["admin-orders"], queryFn: () => fetchOrders() });

  const mutation = useMutation({
    mutationFn: (input: { orderId: string; status: "new" | "paid" | "shipped" | "cancelled"; trackingNumber?: string }) =>
      setStatus({ data: input }),
    onSuccess: () => {
      toast.success("Uloženo");
      void queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Chyba"),
  });

  if (ordersQuery.isError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl">Nemáš oprávnění administrátora</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Přiřaď svému účtu roli „admin“ v databázi a zkus to znovu.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl">Administrace</h1>
        <Button
          variant="outline"
          onClick={async () => {
            await supabase.auth.signOut();
            void navigate({ to: "/auth" });
          }}
        >
          Odhlásit
        </Button>
      </div>

      <Tabs defaultValue="orders" className="mt-8">
        <TabsList>
          <TabsTrigger value="orders">Objednávky</TabsTrigger>
          <TabsTrigger value="stock">Sklad</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6 space-y-4">
          {(ordersQuery.data ?? []).map((order: OrderRow) => (
            <OrderCard
              key={order.id}
              order={order}
              busy={mutation.isPending}
              onStatus={(status, trackingNumber) =>
                mutation.mutate({
                  orderId: order.id,
                  status,
                  ...(trackingNumber ? { trackingNumber } : {}),
                })
              }
            />
          ))}
          {ordersQuery.data?.length === 0 && (
            <p className="text-sm text-muted-foreground">Zatím žádné objednávky.</p>
          )}
        </TabsContent>

        <TabsContent value="stock" className="mt-6">
          <StockTables />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OrderCard({
  order,
  busy,
  onStatus,
}: {
  order: OrderRow;
  busy: boolean;
  onStatus: (status: "new" | "paid" | "shipped" | "cancelled", trackingNumber?: string) => void;
}) {
  const [tracking, setTracking] = useState(order.tracking_number ?? "");

  return (
    <article className="rounded-lg border border-border bg-card p-5 shadow-soft">
      <div className="flex flex-wrap items-center gap-3">
        <strong className="font-display text-xl">#{order.order_number}</strong>
        <Badge variant={order.status === "shipped" ? "default" : "secondary"}>{order.status}</Badge>
        <span className="text-sm text-muted-foreground">
          {order.customer_name} · {order.email} · {order.phone}
        </span>
        <strong className="ml-auto">{formatPrice(order.total, "cs")}</strong>
      </div>

      <p className="mt-2 text-sm text-muted-foreground">{order.pickup_point}</p>
      {order.note && <p className="mt-1 text-sm text-muted-foreground">Poznámka: {order.note}</p>}

      <ul className="mt-3 space-y-1 text-sm">
        {order.order_items.map((item) => (
          <li key={item.id} className="flex items-center gap-2">
            <span
              className="size-3 rounded-full border border-border"
              style={{ backgroundColor: item.color_hex }}
              aria-hidden
            />
            {item.quantity}× {item.packaging_name_cs} · {item.scent_name_cs} · {item.color_name_cs}
            {item.message ? ` · „${item.message}“` : ""}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button size="sm" disabled={busy || order.status !== "new"} onClick={() => onStatus("paid")}>
          Označit zaplaceno
        </Button>
        <Input
          className="w-48"
          placeholder="Sledovací číslo"
          value={tracking}
          onChange={(event) => setTracking(event.target.value)}
        />
        <Button
          size="sm"
          variant="outline"
          disabled={busy || !tracking.trim()}
          onClick={() => onStatus("shipped", tracking.trim())}
        >
          Odesláno
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={busy || order.status === "cancelled"}
          onClick={() => onStatus("cancelled")}
        >
          Zrušit
        </Button>
      </div>
    </article>
  );
}

function StockTables() {
  const queryClient = useQueryClient();
  const scents = useQuery(scentsQuery);
  const colors = useQuery(colorsQuery);
  const packagings = useQuery(packagingsQuery);

  async function saveStock(table: "scents" | "colors" | "packagings", id: string, stock: number) {
    const { error } = await supabase.from(table).update({ stock }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Sklad uložen");
    void queryClient.invalidateQueries({ queryKey: [table] });
  }

  const groups = [
    { table: "packagings" as const, label: "Obaly", rows: packagings.data ?? [] },
    { table: "scents" as const, label: "Vůně", rows: scents.data ?? [] },
    { table: "colors" as const, label: "Barvy", rows: colors.data ?? [] },
  ];

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {groups.map((group) => (
        <section key={group.table}>
          <h2 className="text-xl">{group.label}</h2>
          <ul className="mt-3 space-y-2">
            {group.rows.map((row) => (
              <li key={row.id} className="flex items-center gap-2">
                <span className="flex-1 text-sm">{row.name_cs}</span>
                <Input
                  type="number"
                  min={0}
                  className="w-20"
                  defaultValue={row.stock}
                  onBlur={(event) => {
                    const next = Number(event.target.value);
                    if (Number.isFinite(next) && next !== row.stock) void saveStock(group.table, row.id, next);
                  }}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
