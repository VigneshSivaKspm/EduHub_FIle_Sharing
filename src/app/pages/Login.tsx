import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { GraduationCap, AlertCircle } from "lucide-react";
import type { UserRole } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(email, password, role);
      if (success) {
        navigate(role === "admin" ? "/admin" : "/student");
      } else {
        setError('Invalid credentials. Try password: "password"');
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-indigo-100">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <CardTitle className="text-3xl">Karthikeyan Analysis</CardTitle>
          <CardDescription className="text-base">
            Secure Student Portal & Content Management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="role">Select Role</Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as UserRole)}
              >
                <SelectTrigger id="role" className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@edu.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="pt-4 border-t">
              <p className="text-xs text-center text-slate-500">
                Demo credentials: Use any email with password:{" "}
                <span className="font-medium text-slate-700">"password"</span>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
