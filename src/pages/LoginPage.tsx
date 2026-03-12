import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import atomicaLogo from "@/assets/atomica-logo.svg";

/* ── Animated Dash Field ── */

const COLS = 20;
const ROWS = 18;
const SPACING_X = 28;
const SPACING_Y = 24;
const DASH_LEN = 10;
const WIDTH = COLS * SPACING_X;
const HEIGHT = ROWS * SPACING_Y;

interface DashDatum {
  cx: number;
  cy: number;
  baseAngle: number;
}

function buildGrid(): DashDatum[] {
  const data: DashDatum[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cx = c * SPACING_X + SPACING_X / 2;
      const cy = r * SPACING_Y + SPACING_Y / 2;
      const t = r / (ROWS - 1);
      const colNorm = (c - (COLS - 1) / 2) / ((COLS - 1) / 2);
      const baseAngle = -Math.PI / 6;
      const archAngle = -colNorm * (Math.PI / 2.5);
      const easedT = t * t * t;
      const angle = baseAngle * (1 - easedT) + archAngle * easedT;
      data.push({ cx, cy, baseAngle: angle });
    }
  }
  return data;
}

const GRID = buildGrid();

function AnimatedDashField() {
  const svgRef = useRef<SVGSVGElement>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const currentAngles = useRef<number[]>(GRID.map((d) => d.baseAngle));
  const rafRef = useRef<number>(0);

  const animate = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const lines = svg.querySelectorAll("line");
    const mouse = mouseRef.current;
    const angles = currentAngles.current;

    for (let i = 0; i < GRID.length; i++) {
      const d = GRID[i];
      let targetAngle = d.baseAngle;

      if (mouse) {
        const dx = mouse.x - d.cx;
        const dy = mouse.y - d.cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist / 160);
        const mouseAngle = Math.atan2(dy, dx);
        targetAngle = d.baseAngle + (mouseAngle - d.baseAngle) * influence * 0.35;
      }

      // Smooth interpolation
      angles[i] += (targetAngle - angles[i]) * 0.08;

      const half = DASH_LEN / 2;
      const cos = Math.cos(angles[i]);
      const sin = Math.sin(angles[i]);
      const line = lines[i];
      if (line) {
        line.setAttribute("x1", String(d.cx - half * cos));
        line.setAttribute("y1", String(d.cy - half * sin));
        line.setAttribute("x2", String(d.cx + half * cos));
        line.setAttribute("y2", String(d.cy + half * sin));
      }
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = WIDTH / rect.width;
    const scaleY = HEIGHT / rect.height;
    mouseRef.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = null;
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {GRID.map((d, i) => {
        const half = DASH_LEN / 2;
        const cos = Math.cos(d.baseAngle);
        const sin = Math.sin(d.baseAngle);
        return (
          <line
            key={i}
            x1={d.cx - half * cos}
            y1={d.cy - half * sin}
            x2={d.cx + half * cos}
            y2={d.cy + half * sin}
            stroke="hsl(220 9% 70%)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

/* ── Login Page ── */

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Already authenticated → go to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate("/", { replace: true });
    } else {
      setError(result.error || "Login failed");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-[900px] grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-lg bg-card">
        {/* Left Panel - Login Form */}
        <div className="flex flex-col justify-center px-10 py-12 md:px-12">
          <h1 className="text-2xl font-bold text-center mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground text-center mb-8">
            Login to your Atomica account
          </p>

          <div className="space-y-5" onKeyDown={handleKeyDown}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <button className="text-xs text-primary hover:underline">
                  Forgot your password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="h-11"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button
              className="w-full h-11 text-sm font-medium"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Logging in…
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">Or continue with</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" className="h-11">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 21.99 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 21.99C7.78997 22.03 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
              </svg>
            </Button>
            <Button variant="outline" className="h-11">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </Button>
            <Button variant="outline" className="h-11">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <button className="text-foreground font-medium underline hover:no-underline">
              Sign up
            </button>
          </p>
        </div>

        {/* Right Panel - Visual */}
        <div className="hidden md:flex flex-col bg-secondary/60 rounded-xl m-2 p-8 relative">
          {/* Logo */}
          <div className="mb-6">
            <img src={atomicaLogo} alt="Atomica" className="h-4" />
          </div>

          {/* Animated Dash Field */}
          <div className="flex-1 flex items-center justify-center">
            <AnimatedDashField />
          </div>

          {/* Caption */}
          <p className="text-sm text-muted-foreground mt-6 max-w-[280px] leading-relaxed">
            Easily design patient treatments with the world's most advanced dental AI-powered solutions.
          </p>
        </div>
      </div>

      {/* Legal text */}
      <p className="text-xs text-muted-foreground mt-6 text-center">
        By clicking continue, you agree to our{" "}
        <button className="underline hover:no-underline">Terms of Service</button>
        {" "}and{" "}
        <button className="underline hover:no-underline">Privacy Policy</button>.
      </p>
    </div>
  );
}
