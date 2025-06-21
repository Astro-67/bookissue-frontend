import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import Input from "@/ui/Input";
import Button from "@/ui/Button";

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 🔐 MOCK login (Replace with real API later)
        let role = "";
        if (email === "student@gmail.com" && password === "student") role = "student";
        else if (email === "staff@gmail.com" && password === "staff") role = "staff";
        else if (email === "ict@gmail.com" && password === "ict") role = "ict";
        else {
            setIsLoading(false);
            return alert("Invalid credentials");
        }

        // Save mock token/role
        localStorage.setItem("user", JSON.stringify({ email, role }));

        // Redirect based on role
        navigate({ to: `/${role}/dashboard` });
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-sm w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Book Issue Tracker System
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <Input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full"
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                    </Button>

                    <div className="mt-6">
                        <div className="text-sm text-gray-600 text-center">
                            <p className="mb-2">Demo Credentials:</p>
                            <div className="space-y-1 text-xs">
                                <p>Student: student@gmail.com / student</p>
                                <p>Staff: staff@gmail.com / staff</p>
                                <p>ICT: ict@gmail.com / ict</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
