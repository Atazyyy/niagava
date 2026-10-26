import { TrendingUp } from "lucide-react";
import Reveal from "./Reveal";
import { buildReport } from "../utils/erp";
import { fmtIDR } from "../data/erp";

export default function Report({ products, transactions }) {
  const report = buildReport(products, transactions).sort((a, b) => b.laba - a.laba);
  const totalQty = report.reduce((a, r) => a + r.qtyTerjual, 0);
  const totalOmzet = report.reduce((a, r) => a + r.omzet, 0);
  const totalLaba = report.reduce((a, r) => a + r.laba, 0);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Unit terjual (bulan ini)", value: totalQty.toLocaleString("id-ID") },
          { label: "Omzet (bulan ini)", value: fmtIDR(totalOmzet) },
          { label: "Laba kotor", value: fmtIDR(totalLaba) },
        ].map((s) => (
          <Reveal key={s.label}>
            <div className="rounded-2xl border border-rule bg-card p-5 text-center">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-dim">
                {s.label}
              </p>
              <p className="mt-2 text-xl font-extrabold text-ink2">{s.value}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="rounded-2xl border border-rule bg-card">
        <div className="inline-flex items-center gap-2 border-b border-rule px-5 py-4">
          <TrendingUp className="h-4 w-4 text-indigox" />
          <p className="text-sm font-extrabold text-ink2">Laporan Laba per Produk</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-rule text-[11px] font-extrabold uppercase tracking-wider text-dim">
                <th className="px-5 py-3">Produk</th>
                <th className="px-5 py-3">Terjual</th>
                <th className="px-5 py-3">Omzet</th>
                <th className="px-5 py-3">Laba Kotor</th>
                <th className="px-5 py-3">Kontribusi Laba</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {report.map((r) => {
                const pct = totalLaba > 0 ? Math.max(2, (r.laba / totalLaba) * 100) : 0;
                return (
                  <tr key={r.id} className={r.laba <= 0 ? "opacity-50" : ""}>
                    <td className="px-5 py-3">
                      <p className="font-bold text-ink2">{r.nama}</p>
                      <p className="text-[11px] text-dim">{r.sku}</p>
                    </td>
                    <td className="px-5 py-3 text-dim">{r.qtyTerjual.toLocaleString("id-ID")}</td>
                    <td className="px-5 py-3 font-semibold text-ink2">{fmtIDR(r.omzet)}</td>
                    <td className="px-5 py-3 font-extrabold text-emerald-600">{fmtIDR(r.laba)}</td>
                    <td className="px-5 py-3">
                      <div className="h-2 w-36 overflow-hidden rounded-full bg-mist">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </td>
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
