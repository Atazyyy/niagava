export const fmtIDR = (n) => "Rp" + (n || 0).toLocaleString("id-ID");

export const todayISO = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
};

export const seedProducts = () => [
  { id: "p1", sku: "KRM-001", nama: "Gelas Kraft 12oz", kategori: "Kemasan", stok: 2400, stokMin: 500, beli: 950, jual: 1600 },
  { id: "p2", sku: "KRM-002", nama: "Paper Bag M", kategori: "Kemasan", stok: 850, stokMin: 1000, beli: 1800, jual: 3000 },
  { id: "p3", sku: "KRM-003", nama: "Cup Plastik 16oz + Tutup", kategori: "Kemasan", stok: 5100, stokMin: 1500, beli: 1200, jual: 2100 },
  { id: "p4", sku: "KRM-004", nama: "Sedotan Kertas 50 pack", kategori: "Kemasan", stok: 320, stokMin: 400, beli: 6500, jual: 11000 },
  { id: "p5", sku: "ATK-001", nama: "Label Sticker A3+ (isi 100)", kategori: "ATK", stok: 640, stokMin: 200, beli: 15000, jual: 25000 },
  { id: "p6", sku: "ATK-002", nama: "Kotak Nasi Bento 750ml", kategori: "Kemasan", stok: 1750, stokMin: 600, beli: 2200, jual: 3800 },
  { id: "p7", sku: "ATK-003", nama: "Tisu Kertas Kitchen 2 ply", kategori: "ATK", stok: 980, stokMin: 300, beli: 4200, jual: 7000 },
  { id: "p8", sku: "ATK-004", nama: "Tali Rafia Bungkus (kg)", kategori: "Lainnya", stok: 140, stokMin: 150, beli: 13000, jual: 22000 },
];

/* seed transaksi 7 hari terakhir */
export const seedTransactions = () => {
  const DAY = 86400000;
  const now = Date.now();
  const tx = [];
  const sales = [
    ["p1", 120, 1], ["p3", 300, 1], ["p6", 80, 1], ["p5", 25, 1],
    ["p2", 60, 1], ["p7", 45, 2], ["p1", 90, 2], ["p3", 210, 2],
    ["p8", 12, 2], ["p6", 110, 3], ["p1", 150, 3], ["p5", 40, 3],
    ["p3", 260, 3], ["p7", 60, 4], ["p2", 45, 4], ["p1", 100, 4],
    ["p6", 95, 4], ["p3", 180, 5], ["p5", 30, 5], ["p8", 8, 5],
    ["p1", 130, 5], ["p7", 70, 6], ["p6", 100, 6], ["p2", 55, 6],
    ["p3", 220, 6], ["p1", 110, 6],
  ];
  const purchases = [
    ["p2", 500, 6], ["p4", 200, 5], ["p8", 50, 3], ["p7", 300, 2],
  ];
  let seq = 0;
  const products = Object.fromEntries(seedProducts().map((p) => [p.id, p]));
  for (const [pid, qty, dayAgo] of sales) {
    tx.push({
      id: "tx-s" + seq++,
      tipe: "keluar",
      productId: pid,
      qty,
      harga: products[pid].jual,
      catatan: "Penjualan counter",
      createdAt: now - dayAgo * DAY + (seq % 6) * 3600000,
    });
  }
  for (const [pid, qty, dayAgo] of purchases) {
    tx.push({
      id: "tx-b" + seq++,
      tipe: "masuk",
      productId: pid,
      qty,
      harga: products[pid].beli,
      catatan: "Restock supplier",
      createdAt: now - dayAgo * DAY,
    });
  }
  return tx.sort((a, b) => b.createdAt - a.createdAt);
};
