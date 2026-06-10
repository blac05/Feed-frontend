import { useState } from "react";
import api from "../Api/axios";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic validation
    if (!form.username || !form.email || !form.password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", form);
      setSuccess("Registration successful!");
      setForm({ username: "", email: "", password: "" });
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h1 className="text-3xl font-bold mb-6">Create Account</h1>
        
        {error && (
          <div className="mb-4 text-red-500">{error}</div>
        )}
        {success && (
          <div className="mb-4 text-green-500">{success}</div>
        )}

        <input
          placeholder="Username"
          className="w-full border p-3 rounded-lg mb-4"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <input
          placeholder="Email"
          type="email"
          className="w-full border p-3 rounded-lg mb-4"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-4"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          className={`w-full bg-blue-600 text-white py-3 rounded-lg ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}