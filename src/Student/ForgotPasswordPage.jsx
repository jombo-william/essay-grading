import { useState } from "react";

export default function ForgotPassword() {
  const [role, setRole] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const data = {
      full_name: formData.get("full_name"),
      email: formData.get("email"),
      role: formData.get("role"),
      identifier: formData.get("identifier"),
      new_password: formData.get("new_password"),
    };

    try {
      const res = await fetch("http://localhost:8000/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.detail || "Error resetting password");
        return;
      }

      alert("Password updated successfully!");
    } catch (err) {
      alert("Server error. Make sure backend is running.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            required
          />

          <select
            name="role"
            className="w-full p-2 border rounded"
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          {role && (
            <input
              type="text"
              name="identifier"
              placeholder={
                role === "student"
                  ? "Registration Number"
                  : "Employee Number"
              }
              className="w-full p-2 border rounded"
              required
            />
          )}

          <input
            type="password"
            name="new_password"
            placeholder="New Password"
            className="w-full p-2 border rounded"
            required
          />

          <button className="w-full bg-blue-600 text-white p-2 rounded">
            Update Password
          </button>
          <button 
            type="button"
            onClick={onBack}
            className="mb-4 text-sm text-blue-600">
            ← Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}