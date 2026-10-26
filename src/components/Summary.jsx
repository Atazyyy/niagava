import { useMemo } from "react";
import { AlertTriangle, Boxes, Receipt, TrendingUp, Wallet } from "lucide-react";
import Reveal from "./Reveal";
import { fmtIDR } from "../data/erp";

function Bars7Hari({ transactions }) {
  const days = useMemo(() => {
    const out = [];
    const t0 = new Date();
    t0.setHours(0, 0, 0, 0);
    for (let i = 6; i >= 0; i--) {
      const d = new Date(t0);
      d.setDate(d.getDate() - i);
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      const tx = transactions.filter(
        (t) => t.tipe === "keluar" && t.createdAt >= d.getTime() && t.createdAt < next.getTime()
      );
      out.push({
        label: d.toLocaleDateString("id-ID", { weekday: "short" }),
        omzet: tx.reduce((a, t) => a + t.qty * t.harga, 0),
      });
    }
    return out;
  }, [transactions]);

  const max = Math.max(...days.map((d) => d.omzet), 1);
  return (
    <div className="flex h-44 items-end gap-2">
      {days.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-2">
          <span className="text-[10px] font-bold text-dim">
            {d.omzet >= 1000000 ? (d.omzet / 1e6).toFixed(1) + "jt" : Math.round(d.omzet / 1000) + "rb"}
          </span>
          <div
            className="w-full rounded-t-lg bg-gradient-to-t from-indigo-500/70 to-indigo-400"
            style={{ height: `${Math.max(5, (d.omzet / max) * 120)}px` }}
            title={fmtIDR(d.omzet)}
          />
          <span className="text-[10px] font-bold uppercase text-dim">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Summary({ products, transactions }) {
  const inventoryValue = products.reduce((a, p) => a + p.stok * p.beli, 0);
  const month = new Date().toISOString().slice(0, 7);
  const salesMonth = transactions.filter(
    (t) => t.tipe === "keluar" && new Date(t.createdAt).toISOString().slice(0, 7) === month
  );
  const omzetMonth = salesMonth.reduce((a, t) => a + t.qty * t.harga, 0);
  const prodMap = Object.fromEntries(products.map((p) => [p.id, p]));
  const labaMonth = salesMonth.reduce(
    (a, t) => a + t.qty * (t.harga - prodMap[t.productId].beli),
    0
  );
  const critical = products.filter((p) => p.stok <= p.stokMin);
  const txCount = transactions.filter(
    (t) => new Date(t.createdAt).toISOString().slice(0, 7) === month
  ).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Boxes, label: "Nilai persediaan", value: fmtIDR(inventoryValue), sub: `${products.length} SKU aktif` },
          { icon: TrendingUp, label: "Omzet bulan ini", value: fmtIDR(omzetMonth), sub: `${salesMonth.length} transaksi keluar` },
          { icon: Wallet, label: "Laba kotor", value: fmtIDR(labaMonth), sub: "harga jual − harga beli" },
          { icon: Receipt, label: "Total transaksi", value: txCount, sub: "masuk + keluar bulan ini" },
        ].map((s) => (
          <Reveal key={s.label}>
            <div className="rounded-2xl border border-rule bg-card p-5">
              <div className="flex items-center gap-2 text-dim">
                <s.icon className="h-4 w-4 text-indigox" />
                <p className="text-[11px] font-extrabold uppercase tracking-wider">{s.label}</p>
              </div>
              <p className="mt-2.5 text-2xl font-extrabold text-ink2">{s.value}</p>
              <p className="mt-0.5 text-xs text-dim">{s.sub}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Reveal className="lg:col-span-3">
          <div className="rounded-2xl border border-rule bg-card p-5">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-dim">
              Omzet penjualan 7 hari terakhir
            </p>
            <div className="mt-4">
              <Bars7Hari transactions={transactions} />
            </div>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-2">
          <div className="h-full rounded-2xl border border-rule bg-card p-5">
            <p className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-dim">
              <AlertTriangle className="h-4 w-4 text-amber-500" /> Stok perlu restock
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-700">
                {critical.length}
              </span>
            </p>
            <ul className="mt-4 space-y-2.5">
              {critical.length === 0 && (
                <li className="rounded-xl bg-mist px-4 py-3 text-sm text-dim">
                  Semua stok aman 👍
                </li>
              )}
              {critical.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-xl bg-mist px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-bold text-ink2">{p.nama}</p>
                    <p className="text-[11px] text-dim">Min. {p.stokMin} {p.sku}</p>
                  </div>
                  <span
                    className={
                      "rounded-full px-2.5 py-1 text-xs font-extrabold " +
                      (p.stok === 0
                        ? "bg-rose-100 text-rose-600"
                        : "bg-amber-100 text-amber-700")
                    }
                  >
                    {p.stok}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
