import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import WingMark from "../components/WingMark";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const me = await login(email, password);
      navigate(me.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh" }} className="auth-grid">
      <div
        style={{
          background: "var(--ink)",
          color: "var(--paper)",
          padding: "56px 48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        className="auth-side"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <WingMark size={28} color="var(--marigold)" />
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem" }}>NayePankh</span>
        </div>
        <div>
          <h1 style={{ color: "var(--paper)", fontSize: "2.4rem", fontWeight: 500, lineHeight: 1.15, marginBottom: 16 }}>
            New wings,<br />for new purpose.
          </h1>
          <p style={{ color: "#C7CCDB", maxWidth: 380, lineHeight: 1.6 }}>
            Coordinate volunteers, review applications, and keep every initiative moving —
            all from one place.
          </p>
        </div>
        <p style={{ color: "#7C87A8", fontSize: "0.8rem" }}>Volunteer Information Management System</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 380 }}>
          <h2 style={{ fontSize: "1.6rem", marginBottom: 6 }}>Welcome back</h2>
          <p style={{ color: "var(--ink-soft)", fontSize: "0.9rem", marginBottom: 28 }}>
            Log in to continue your volunteering journey.
          </p>

          {error && <div className="error-banner">{error}</div>}

          <div style={{ marginBottom: 16 }}>
            <label className="field-label">Email</label>
            <input
              className="field-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="field-label">Password</label>
            <input
              className="field-input"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button className="btn btn-accent" type="submit" disabled={busy} style={{ width: "100%" }}>
            {busy ? "Logging in…" : "Log in"}
          </button>

          <p style={{ marginTop: 22, fontSize: "0.88rem", color: "var(--ink-soft)", textAlign: "center" }}>
            New here?{" "}
            <Link to="/register" style={{ color: "var(--marigold-deep)", fontWeight: 600, textDecoration: "none" }}>
              Register as a volunteer
            </Link>
          </p>
        </form>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .auth-grid { grid-template-columns: 1fr !important; }
          .auth-side { display: none !important; }
        }
      `}</style>
    </div>
  );
}
