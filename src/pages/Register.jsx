import { useState } from "react";
import api from "../Api/axios";

export default function Register() {
  const [form, setForm] =
    useState({
      username: "",
      email: "",
      password: "",
    });

  const submit = async e => {
    e.preventDefault();

    await api.post(
      "/auth/register",
      form
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h1 className="text-3xl font-bold mb-6">
          Create Account
        </h1>

        <input
          placeholder="Username"
          className="w-full border p-3 rounded-lg mb-4"
          onChange={e =>
            setForm({
              ...form,
              username:
                e.target.value,
            })
          }
        />

        <input
          placeholder="Email"
          className="w-full border p-3 rounded-lg mb-4"
          onChange={e =>
            setForm({
              ...form,
              email:
                e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-4"
          onChange={e =>
            setForm({
              ...form,
              password:
                e.target.value,
            })
          }
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
          Register
        </button>
      </form>
    </div>
  );
}