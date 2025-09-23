import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockApiService } from "../../services/mockApiUpdated";
import { Button, Input } from "../ui";

const roles = [
  { value: "SA", label: "Solution Architect (SA)" },
  { value: "EAO", label: "Enterprise Architecture Office (EAO)" }
];

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = username.trim() !== "" && role && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      await mockApiService.login(username.trim(), role);
      navigate("/"); // adjust route if needed
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md border border-gray-200 p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
              <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
            />
            </label>
            
          </div>

            <div>
              <span className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </span>
              <div className="space-y-2">
                {roles.map(r => (
                  <label
                    key={r.value}
                    className="flex items-center gap-2 cursor-pointer text-sm text-gray-800"
                  >
                    <input
                      type="radio"
                      className="text-primary-600"
                      name="role"
                      value={r.value}
                      checked={role === r.value}
                      onChange={() => setRole(r.value)}
                    />
                    {r.label}
                  </label>
                ))}
              </div>
            </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={!canSubmit}
            className="w-full justify-center"
          >
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;