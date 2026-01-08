import { useState } from "react";

export default function AddNews() {
  const [form, setForm] = useState({
    title: "",
    desc: "",
    image: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    alert("News berhasil ditambahkan");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6">
      <input
        className="border p-2 w-full mb-3"
        placeholder="Judul"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        className="border p-2 w-full mb-3"
        placeholder="Deskripsi"
        onChange={(e) => setForm({ ...form, desc: e.target.value })}
      />

      <input
        className="border p-2 w-full mb-3"
        placeholder="Path / URL gambar"
        onChange={(e) => setForm({ ...form, image: e.target.value })}
      />

      <button className="bg-orange-500 text-white px-4 py-2 rounded">
        Add News
      </button>
    </form>
  );
}
