import { useState } from "react";
import { Boxes, FileBarChart, RotateCcw, Warehouse } from "lucide-react";
import Summary from "./components/Summary";
import StockTable from "./components/StockTable";
import TxSection from "./components/TxSection";
import Report from "./components/Report";
import { loadAll, recordTx, resetAll } from "./utils/erp";

const TABS = [
  { id: "ringkasan", label: "Ringkasan", icon: FileBarChart },
  { id: "stok", label: "Stok", icon: Boxes },
  { id: "transaksi", label: "Transaksi", icon: Warehouse },
  { id: "laporan", label: "Laporan", icon: FileBarChart },
];

export default function App() {
  const [tab, setTab] = useState("ringkasan");
  const [prefill, setPrefill] = useState(null);
  const [{ products, transactions }, setState] = useState(() => loadAll());

  const onRecord = (data) => {
    const res = recordTx(products, transactions, data);
    if (!res.error) setState({ products: res.products, transactions: res.transactions });
    return res;
  };

  return (
    <div className="min-h-screen bg-mist font-sans text-ink2 antialiased">
      {/* topbar */}
      <header className="border-b border-rule bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3.5 md:px-8">
          <p className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigox text-white">
              <Boxes className="h-4.5 w-4.5" />
            </span>
            Niaga<span className="text-indigox">va</span>
          </p>
          <div className="flex items-center gap-2">
            <p className="hidden rounded-full border border-rule bg-mist px-3.5 py-1.5 text-xs font-bold text-dim sm:block">
              Distributor kemasan "Nusa Pack" — data fiktif
            </p>
            <button
              onClick={() => setState(resetAll())}
              className="inline-flex items-center gap-1.5 rounded-full border border-rule px-3.5 py-1.5 text-xs font-bold text-dim transition hover:text-ink2"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset demo
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Dashboard ERP Mini
        </h1>
        <p className="mt-1.5 text-sm text-dim">
          Stok, transaksi masuk/keluar, dan laporan laba — semuanya tersambung:
          setiap transaksi langsung mengubah stok.
        </p>

        <nav className="mt-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id + t.label}
              onClick={() => setTab(t.id)}
              className={
                "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition " +
                (tab === t.id
                  ? "bg-indigox text-white"
                  : "border border-rule bg-card text-dim hover:text-ink2")
              }
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </nav>

        <div className="mt-6">
          {tab === "ringkasan" && (
            <Summary products={products} transactions={transactions} />
          )}
          {tab === "stok" && (
            <StockTable
              products={products}
              onPrefill={(productId, tipe) => {
                setTab("transaksi");
                setPrefill({ productId, tipe, _t: Date.now() });
              }}
            />
          )}
          {tab === "transaksi" && (
            <TxSection
              products={products}
              transactions={transactions}
              onRecord={onRecord}
              prefill={prefill}
            />
          )}
          {tab === "laporan" && (
            <Report products={products} transactions={transactions} />
          )}
        </div>
      </main>

      <footer className="border-t border-rule bg-card">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-5 py-5 text-xs text-dim sm:flex-row sm:items-center md:px-8">
          <p>© 2026 Niagava · Data "Nusa Pack" seluruhnya fiktif (concept demo).</p>
          <p>
            Dibuat oleh{" "}
            <a
              href="https://github.com/Atazyyy"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-ink2"
            >
              Agni Miftah Fauzi
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
