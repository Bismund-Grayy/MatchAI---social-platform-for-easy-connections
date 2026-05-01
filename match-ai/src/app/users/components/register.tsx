import React, { useState } from "react";
import Link from "next/link";
import { supabase, logActivity } from "../../../../utils/supabase";

interface RegisterProps {
  onSwitch: () => void;
}

const RegisterComponent: React.FC<RegisterProps> = ({ onSwitch }) => {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    const { email, username, password, confirmPassword } = form;

    if (!email || !username || !password || !confirmPassword) {
      return "All fields are required";
    }
    if (username.length < 3) return "Username must be at least 3 characters";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirmPassword) return "Passwords do not match";

    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const validationError = validateForm();
    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    setLoading(true);

    try {
      const { email, username, password } = form;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });

      if (error) throw new Error(error.message);

      setMessage({
        type: "success",
        text: "Account created! Check your email to verify.",
      });

      setForm({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      });

    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <section className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-2">
          Register
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Create your MatchAI account
        </p>

        {message && (
          <p
            className={`text-sm p-2 rounded mb-4 text-center ${
              message.type === "success"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {message.text}
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">

          <input
            id="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            disabled={loading}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
          />

          <input
            id="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
          />

          <input
            id="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
          />

          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            disabled={loading}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-500">
          <Link href="/" className="hover:underline block mb-2">
            Back to main page
          </Link>

          Already have an account?{" "}
          <button
            onClick={onSwitch}
            className="text-indigo-600 hover:underline"
          >
            Login
          </button>
        </div>

      </section>
    </main>
  );
};

export default RegisterComponent;