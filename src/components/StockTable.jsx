import { PackageMinus, PackagePlus, RotateCcw } from "lucide-react";
import { fmtIDR } from "../data/erp";

export default function StockTable({ products, onPrefill }) {
  return (
    <div className="rounded-2xl border border-rule bg-card">
      <div className="flex items-center justify-between border-b border-rule px-5 py-4">
        <p className="text-sm font-extrabold text-ink2">Daftar Stok</p>
        <p className="inline-flex items-center gap-1.5 text-xs text-dim">
          <RotateCcw className="h-3.5 w-3.5" /> Klik baris untuk catat transaksi
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-rule text-[11px] font-extrabold uppercase tracking-wider text-dim">
              <th className="px-5 py-3">SKU</th>
              <th className="px-5 py-3">Produk</th>
              <th className="px-5 py-3">Kategori</th>
              <th className="px-5 py-3">Stok</th>
              <th className="px-5 py-3">H. Beli</th>
              <th className="px-5 py-3">H. Jual</th>
              <th className="px-5 py-3">Margin</th>
              <th className="px-5 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            {products.map((p) => {
              const kritikal = p.stok <= p.stokMin;
              const margin = Math.round(((p.jual - p.beli) / p.beli) * 100);
              return (
                <tr key={p.id} className="hover:bg-mist/60">
                  <td className="px-5 py-3 font-mono text-xs font-bold text-indigox">{p.sku}</td>
                  <td className="px-5 py-3 font-bold text-ink2">{p.nama}</td>
                  <td className="px-5 py-3 text-dim">{p.kategori}</td>
                  <td className="px-5 py-3">
                    <span
                      className={
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-extrabold " +
                        (p.stok === 0
                          ? "bg-rose-100 text-rose-600"
                          : kritikal
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700")
                      }
                    >
                      {p.stok.toLocaleString("id-ID")}
                    </span>
                    {kritikal && (
                      <span className="ml-1.5 text-[10px] font-bold text-amber-600">
                        min {p.stokMin}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-dim">{fmtIDR(p.beli)}</td>
                  <td className="px-5 py-3 font-semibold text-ink2">{fmtIDR(p.jual)}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-extrabold text-indigox">
                      +{margin}%
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => onPrefill(p.id, "masuk")}
                        title="Catat barang masuk"
                        className="inline-flex items-center gap-1 rounded-lg border border-rule px-2.5 py-1.5 text-xs font-bold text-dim transition hover:border-indigox hover:text-indigox"
                      >
                        <PackagePlus className="h-3.5 w-3.5" /> Masuk
                      </button>
                      <button
                        onClick={() => onPrefill(p.id, "keluar")}
                        title="Catat barang keluar"
                        className="inline-flex items-center gap-1 rounded-lg bg-indigox px-2.5 py-1.5 text-xs font-bold text-white transition hover:brightness-110"
                      >
                        <PackageMinus className="h-3.5 w-3.5" /> Keluar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
