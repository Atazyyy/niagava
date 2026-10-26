import { seedProducts, seedTransactions } from "../data/erp";

const KEY_P = "ngv-products-v1";
const KEY_T = "ngv-transactions-v1";

export function loadAll() {
  let products, transactions;
  try {
    products = JSON.parse(localStorage.getItem(KEY_P));
    transactions = JSON.parse(localStorage.getItem(KEY_T));
  } catch {
    /* abaikan */
  }
  if (!Array.isArray(products) || !Array.isArray(transactions)) {
    products = seedProducts();
    transactions = seedTransactions();
    saveAll(products, transactions);
  }
  return { products, transactions };
}

export function saveAll(products, transactions) {
  try {
    localStorage.setItem(KEY_P, JSON.stringify(products));
    localStorage.setItem(KEY_T, JSON.stringify(transactions));
  } catch {
    /* abaikan */
  }
}

/* Catat transaksi & update stok. return {products, transactions, error} */
export function recordTx(products, transactions, { productId, tipe, qty, catatan }) {
  qty = parseInt(qty);
  if (!productId) return { error: "Pilih produk dulu." };
  if (!qty || qty < 1) return { error: "Jumlah minimal 1." };

  const product = products.find((p) => p.id === productId);
  if (tipe === "keluar" && qty > product.stok)
    return { error: `Stok ${product.nama} tinggal ${product.stok} — tidak cukup.` };

  const tx = {
    id: "tx-" + Date.now(),
    tipe,
    productId,
    qty,
    harga: tipe === "masuk" ? product.beli : product.jual,
    catatan: catatan.trim() || (tipe === "masuk" ? "Barang masuk" : "Barang keluar"),
    createdAt: Date.now(),
  };
  const nextProducts = products.map((p) =>
    p.id === productId
      ? { ...p, stok: p.stok + (tipe === "masuk" ? qty : -qty) }
      : p
  );
  const nextTx = [tx, ...transactions];
  saveAll(nextProducts, nextTx);
  return { products: nextProducts, transactions: nextTx };
}

export function resetAll() {
  const products = seedProducts();
  const transactions = seedTransactions();
  saveAll(products, transactions);
  return { products, transactions };
}

/* Laporan per produk (bulan ini) */
export function buildReport(products, transactions) {
  const month = new Date().toISOString().slice(0, 7);
  return products.map((p) => {
    const keluar = transactions.filter(
      (t) => t.productId === p.id && t.tipe === "keluar" &&
        new Date(t.createdAt).toISOString().slice(0, 7) === month
    );
    const qty = keluar.reduce((a, t) => a + t.qty, 0);
    const omzet = keluar.reduce((a, t) => a + t.qty * t.harga, 0);
    const modal = qty * p.beli;
    return { ...p, qtyTerjual: qty, omzet, laba: omzet - modal };
  });
}
