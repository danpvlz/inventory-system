"use client";

import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types/product";
import { useEffect, useState } from "react";
import Modal from "@/components/custom/Modal";
import { Movement } from "@/types/movement";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Pen, Plus, Trash2 } from "lucide-react";

export default function ProductsPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [movementsModalOpen, setMovementsModalOpen] = useState(false);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [movementsProduct, setMovementsProduct] = useState<Product | null>(null);
  const [stockMap, setStockMap] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchProductsAndStock();
  }, []);

  async function fetchProductsAndStock() {
    setLoading(true);
    const { data: products, error: prodError } = await supabase.from("products").select("*");
    if (prodError || !products) {
      setLoading(false);
      return;
    }
    // Calculate stock for each product
    const stock: Record<string, number> = {};
    for (const product of products) {
      stock[product.id] = product.stock ?? 0;
    }
    setProducts(products);
    setStockMap(stock);
    setLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function openAddModal() {
    setEditId(null);
    setForm({ name: "", sku: "", category: "", price: "", stock: "", description: "" });
    setModalOpen(true);
  }

  function openEditModal(product: Product) {
    setEditId(product.id);
    setForm({
      name: product.name || "",
      sku: product.sku || "",
      category: product.category || "",
      price: product.price?.toString() || "",
      stock: product.stock?.toString() || "",
      description: product.description || "",
    });
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const { name, sku, category, price, stock, description } = form;
    if (editId) {
      // Update
      const { error } = await supabase.from("products").update({
        name,
        sku,
        category: category || null,
        price: price ? parseFloat(price) : 0,
        stock: stock ? parseInt(stock) : 0,
        description: description || null,
      }).eq("id", editId);
      setSubmitting(false);
      if (error) {
        setError(error.message);
        return;
      }
    } else {
      // Create
      const { data, error } = await supabase.from("products").insert([
        {
          name,
          sku,
          category: category || null,
          price: price ? parseFloat(price) : 0,
          stock: stock ? parseInt(stock) : 0,
          description: description || null,
        },
      ]).select();
      setSubmitting(false);
      if (error || !data || !data[0]) {
        setError(error?.message || "Could not create product");
        return;
      }
      // Register initial stock movement if stock > 0
      const initialStock = stock ? parseInt(stock) : 0;
      if (initialStock > 0) {
        await supabase.from("movements").insert([
          {
            product_id: data[0].id,
            type: "initial",
            quantity: initialStock,
            date: new Date().toISOString().slice(0, 10),
            note: "Initial stock registered",
          },
        ]);
      }
    }
    setModalOpen(false);
    setForm({ name: "", sku: "", category: "", price: "", stock: "", description: "" });
    setEditId(null);
    fetchProductsAndStock();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setLoading(true);
    await supabase.from("products").delete().eq("id", id);
    fetchProductsAndStock();
  }

  async function openMovementsModal(product: Product) {
    setMovementsProduct(product);
    setMovementsModalOpen(true);
    // Fetch all movements for this product from the unified table
    const { data: moves, error } = await supabase
      .from("movements")
      .select("*")
      .eq("product_id", product.id)
      .order("created_at", { ascending: false });
    setMovements(moves || []);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={openAddModal}><Plus /> Add Product</Button>
      </div>
      <div className="rounded shadow overflow-hidden rounded-lg border">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="w-[16.67%] pl-3">Name</TableHead>
                <TableHead className="w-[16.67%]">SKU</TableHead>
                <TableHead className="w-[16.67%]">Category</TableHead>
                <TableHead className="w-[16.67%]">Price</TableHead>
                <TableHead className="w-[16.67%]">Stock</TableHead>
                <TableHead className="w-[16.67%] pr-3">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium pl-3">{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.category || "-"}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell className="font-bold">{stockMap[product.id] ?? "-"}</TableCell>
                  <TableCell className="flex gap-3 pr-3">
                    <Button size="sm" variant="outline" onClick={() => openMovementsModal(product)}><Eye /> Movements</Button>
                    <Button size="sm" variant="outline" onClick={() => openEditModal(product)}><Pen /> Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(product.id)}><Trash2 /> Delete</Button>
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
        title={editId ? "Edit Product" : "Add Product"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SKU</label>
            <input
              name="sku"
              value={form.sku}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
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
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows={2}
            />
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
      <Modal
        isOpen={movementsModalOpen}
        onClose={() => setMovementsModalOpen(false)}
        title={movementsProduct ? `Movements for ${movementsProduct.name}` : "Movements"}
      >
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {movements.length === 0 && <div>No movements found.</div>}
          {movements.map((m, i) => (
            <div key={i} className="border rounded p-2 flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold capitalize">
                  {m.type === "initial" ? "Initial Stock" : m.type}
                </span>
                <span className="text-xs">{m.date}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <span>Qty: <span className="font-bold">{m.quantity}</span></span>
                {m.type === "initial" && m.note && <span>Note: {m.note}</span>}
                {m.type === "input" && m.note && <span>Note: {m.note}</span>}
                {m.type === "output" && m.reason && <span>Reason: {m.reason}</span>}
                {m.type === "sale" && <>
                  {m.customer_name && <span>Customer: {m.customer_name}</span>}
                  {m.price !== undefined && <span>Price: ${m.price.toFixed(2)}</span>}
                  {m.payment_status && <span>Status: {m.payment_status}</span>}
                  {m.note && <span>Note: {m.note}</span>}
                </>}
                {m.note && m.type !== "initial" && m.type !== "input" && m.type !== "sale" && <span>Note: {m.note}</span>}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
} 