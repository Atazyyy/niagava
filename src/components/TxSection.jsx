import { useEffect, useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { fmtIDR } from "../data/erp";

export default function TxSection({ products, transactions, onRecord, prefill }) {
  const [tipe, setTipe] = useState("keluar");
  const [productId, setProductId] = useState(products[0]?.id || "");
  const [qty, setQty] = useState("");
  const [catatan, setCatatan] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (prefill) {
      setProductId(prefill.productId);
      setTipe(prefill.tipe);
      document.getElementById("tx-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [prefill]);

  const product = products.find((p) => p.id === productId);
  const estimasi = (parseInt(qty) || 0) * (product ? (tipe === "masuk" ? product.beli : product.jual) : 0);

  const submit = (e) => {
    e.preventDefault();
    setError("");
    const res = onRecord({ productId, tipe, qty, catatan });
    if (res.error) return setError(res.error);
    setQty("");
    setCatatan("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* form transaksi */}
      <form
        id="tx-form"
        onSubmit={submit}
        className="h-fit rounded-2xl border border-rule bg-card p-5 lg:col-span-2"
      >
        <p className="text-sm font-extrabold text-ink2">Catat Transaksi</p>
        <div className="mt-3 flex rounded-xl border border-rule bg-mist p-1">
          {[
            { id: "masuk", label: "Barang Masuk", icon: ArrowDownToLine },
            { id: "keluar", label: "Barang Keluar", icon: ArrowUpFromLine },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTipe(t.id)}
              className={
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-extrabold transition " +
                (tipe === t.id
                  ? t.id === "masuk"
                    ? "bg-emerald-500 text-white"
                    : "bg-indigox text-white"
                  : "text-dim hover:text-ink2")
              }
            >
              <t.icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          ))}
        </div>

        <label className="mt-4 block">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-dim">Produk</span>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="mt-1 w-full rounded-xl border border-rule bg-mist px-3 py-2.5 text-sm font-semibold text-ink2 outline-none focus:border-indigox"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama} (stok {p.stok})
              </option>
            ))}
          </select>
        </label>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-dim">Jumlah</span>
            <input
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              inputMode="numeric"
              placeholder="cth. 100"
              className="mt-1 w-full rounded-xl border border-rule bg-mist px-3 py-2.5 text-sm font-semibold text-ink2 outline-none focus:border-indigox"
            />
          </label>
          <label className="block">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-dim">Catatan</span>
            <input
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="opsional"
              className="mt-1 w-full rounded-xl border border-rule bg-mist px-3 py-2.5 text-sm font-semibold text-ink2 outline-none placeholder:font-normal focus:border-indigox"
            />
          </label>
        </div>

        <p className="mt-3 rounded-xl bg-mist px-4 py-2.5 text-xs font-bold text-dim">
          {tipe === "masuk" ? "Estimasi pembelian" : "Estimasi penjualan"}:{" "}
          <span className="text-ink2">{fmtIDR(estimasi)}</span>
        </p>

        {error && (
          <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="mt-4 w-full rounded-xl bg-indigox px-4 py-3 text-sm font-extrabold text-white transition hover:brightness-110"
        >
          Simpan Transaksi
        </button>
      </form>

      {/* tabel transaksi */}
      <div className="rounded-2xl border border-rule bg-card lg:col-span-3">
        <div className="border-b border-rule px-5 py-4">
          <p className="text-sm font-extrabold text-ink2">Transaksi Terbaru</p>
        </div>
        <div className="max-h-[26rem] overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-card">
              <tr className="border-b border-rule text-[11px] font-extrabold uppercase tracking-wider text-dim">
                <th className="px-5 py-3">Waktu</th>
                <th className="px-5 py-3">Produk</th>
                <th className="px-5 py-3">Jumlah</th>
                <th className="px-5 py-3">Nilai</th>
                <th className="px-5 py-3">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {transactions.slice(0, 25).map((t) => {
                const p = products.find((x) => x.id === t.productId);
                return (
                  <tr key={t.id}>
                    <td className="whitespace-nowrap px-5 py-2.5 text-xs text-dim">
                      {new Date(t.createdAt).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-5 py-2.5 font-semibold text-ink2">{p?.nama}</td>
                    <td className="px-5 py-2.5">
                      <span
                        className={
                          "rounded-full px-2 py-0.5 text-xs font-extrabold " +
                          (t.tipe === "masuk"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-indigo-50 text-indigox")
                        }
                      >
                        {t.tipe === "masuk" ? "+" : "−"}
                        {t.qty}
                      </span>
                    </td>
                    <td className="px-5 py-2.5 font-semibold text-ink2">
                      {fmtIDR(t.qty * t.harga)}
                    </td>
                    <td className="px-5 py-2.5 text-xs text-dim">{t.catatan}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
