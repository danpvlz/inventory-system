"use client";

import { createClient } from "@/lib/supabase/client";
import { Movement } from "@/types/movement";
import { useEffect, useState } from "react";
import Modal from "@/components/custom/Modal";
import { Pen, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function SalesPage() {
  const supabase = createClient();
  const [sales, setSales] = useState<Movement[]>([]);
  const [products, setProducts] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    product_id: "",
    quantity: "",
    price: "",
    date: "",
    customer_name: "",
    note: "",
    payment_status: "pending",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, []);

  async function fetchSales() {
    setLoading(true);
    const { data, error } = await supabase.from("movements").select("*").eq("type", "sale");
    if (!error && data) setSales(data);
    setLoading(false);
  }

  async function fetchProducts() {
    const { data } = await supabase.from("products").select("id, name");
    if (data) setProducts(data);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function openAddModal() {
    setEditId(null);
    setForm({ product_id: "", quantity: "", price: "", date: "", customer_name: "", note: "", payment_status: "pending" });
    setModalOpen(true);
  }

  function openEditModal(sale: Movement) {
    setEditId(sale.id);
    setForm({
      product_id: sale.product_id,
      quantity: sale.quantity.toString(),
      price: sale.price?.toString() || "",
      date: sale.date,
      customer_name: sale.customer_name || "",
      note: sale.note || "",
      payment_status: sale.payment_status || "pending",
    });
    setModalOpen(true);
  }

  async function updateProductStock(product_id: string) {
    // Get all movements for this product
    const { data: moves } = await supabase.from("movements").select("type, quantity").eq("product_id", product_id);
    let stock = 0;
    if (moves) {
      for (const m of moves) {
        if (m.type === "initial" || m.type === "input") stock += m.quantity;
        if (m.type === "output" || m.type === "sale") stock -= m.quantity;
      }
    }
    await supabase.from("products").update({ stock }).eq("id", product_id);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const { product_id, quantity, price, date, customer_name, note, payment_status } = form;
    if (editId) {
      const { error } = await supabase.from("movements").update({
        product_id,
        type: "sale",
        quantity: quantity ? parseInt(quantity) : 0,
        price: price ? parseFloat(price) : 0,
        date,
        customer_name: customer_name || null,
        note: note || null,
        payment_status,
      }).eq("id", editId);
      setSubmitting(false);
      if (error) {
        setError(error.message);
        return;
      }
      await updateProductStock(product_id);
    } else {
      const { error } = await supabase.from("movements").insert([
        {
          product_id,
          type: "sale",
          quantity: quantity ? parseInt(quantity) : 0,
          price: price ? parseFloat(price) : 0,
          date,
          customer_name: customer_name || null,
          note: note || null,
          payment_status,
        },
      ]);
      setSubmitting(false);
      if (error) {
        setError(error.message);
        return;
      }
      await updateProductStock(product_id);
    }
    setModalOpen(false);
    setForm({ product_id: "", quantity: "", price: "", date: "", customer_name: "", note: "", payment_status: "pending" });
    setEditId(null);
    fetchSales();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;
    setLoading(true);
    await supabase.from("movements").delete().eq("id", id);
    fetchSales();
    const deleted = sales.find(i => i.id === id);
    await updateProductStock(deleted?.product_id || "");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Sales</h1>
        <Button onClick={openAddModal}><Plus /> Add Sale</Button>
      </div>
      <div className="rounded shadow overflow-hidden rounded-lg border">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <Table>
  <TableHeader className="bg-muted">
    <TableRow>
      <TableHead className="text-left p-2">Product</TableHead>
      <TableHead className="text-left p-2">Quantity</TableHead>
      <TableHead className="text-left p-2">Price</TableHead>
      <TableHead className="text-left p-2">Date</TableHead>
      <TableHead className="text-left p-2">Customer</TableHead>
      <TableHead className="text-left p-2">Payment</TableHead>
      <TableHead className="text-left p-2">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {sales.map((sale) => (
      <TableRow key={sale.id} className="border-t">
        <TableCell className="p-2">
          {products.find((p) => p.id === sale.product_id)?.name || "-"}
        </TableCell>
        <TableCell className="p-2">{sale.quantity}</TableCell>
        <TableCell className="p-2">
          {sale.price != null ? `$${sale.price.toFixed(2)}` : "-"}
        </TableCell>
        <TableCell className="p-2">{sale.date}</TableCell>
        <TableCell className="p-2">{sale.customer_name || "-"}</TableCell>
        <TableCell className="p-2">{sale.payment_status || "-"}</TableCell>
        <TableCell className="flex gap-2 p-2">
          <Button size="sm" variant="outline" onClick={() => openEditModal(sale)}><Pen /> Edit</Button>
          <Button size="sm" variant="outline" onClick={() => handleDelete(sale.id)}><Trash2 /> Delete</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
        )}
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditId(null);
        }}
        title={editId ? "Edit Sale" : "Add Sale"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product</label>
            <select
              name="product_id"
              value={form.product_id}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select a product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              name="price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Customer Name</label>
            <input
              name="customer_name"
              value={form.customer_name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Note</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Payment Status</label>
            <select
              name="payment_status"
              value={form.payment_status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded border"
              onClick={() => {
                setModalOpen(false);
                setEditId(null);
              }}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white"
              disabled={submitting}
            >
              {submitting ? (editId ? "Saving..." : "Saving...") : editId ? "Save Changes" : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
} 