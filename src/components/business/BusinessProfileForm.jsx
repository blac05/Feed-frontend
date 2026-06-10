import { useState } from "react";

export default function BusinessProfileForm() {
  const [form, setForm] = useState({
    companyName: "",
    website: "",
    description: "",
  });

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just log the form data
    console.log("Submitted form data:", form);
    alert("Profile submitted!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-6 shadow max-w-md mx-auto"
    >
      <input
        name="companyName"
        placeholder="Company Name"
        value={form.companyName}
        onChange={handleChange}
        className="border p-3 w-full rounded-lg mb-4"
        required
      />

      <input
        name="website"
        placeholder="Website"
        value={form.website}
        onChange={handleChange}
        className="border p-3 w-full rounded-lg mb-4"
        required
        type="url"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="border p-3 w-full rounded-lg mb-4"
        rows={4}
        required
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Save Profile
      </button>
    </form>
  );
}