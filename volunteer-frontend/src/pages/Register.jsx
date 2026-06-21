import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import WingMark from "../components/WingMark";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", address: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.register(form);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (success) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div className="card" style={{ maxWidth: 420, padding: 40, textAlign: "center" }}>
          <WingMark size={36} color="var(--teal)" />
          <h2 style={{ marginTop: 18, marginBottom: 10 }}>Application received</h2>
          <p style={{ color: "var(--ink-soft)", lineHeight: 1.6, marginBottom: 24 }}>
            Your volunteer account has been created and is awaiting admin approval.
            You'll be able to log in once it's reviewed.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ textDecoration: "none" }}>
            Back to log in
          </Link>
        </div>
      </div>
    );
  }

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
          <h1 style={{ color: "var(--paper)", fontSize: "2.2rem", fontWeight: 500, lineHeight: 1.18, marginBottom: 16 }}>
            Every volunteer<br />starts here.
          </h1>
          <p style={{ color: "#C7CCDB", maxWidth: 380, lineHeight: 1.6 }}>
            Tell us a bit about yourself. An admin will review and approve your
            application shortly.
          </p>
        </div>
        <p style={{ color: "#7C87A8", fontSize: "0.8rem" }}>Volunteer Information Management System</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 400 }}>
          <h2 style={{ fontSize: "1.6rem", marginBottom: 6 }}>Create your account</h2>
          <p style={{ color: "var(--ink-soft)", fontSize: "0.9rem", marginBottom: 24 }}>
            It only takes a minute.
          </p>

          {error && <div className="error-banner">{error}</div>}

          <div style={{ marginBottom: 14 }}>
            <label className="field-label">Full name</label>
            <input className="field-input" required value={form.name} onChange={update("name")} placeholder="Sonali Kumari" />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label className="field-label">Email</label>
            <input
              className="field-input"
              type="email"
              required
              value={form.email}
              onChange={update("email")}
              placeholder="you@example.com"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div>
              <label className="field-label">Password</label>
              <input
                className="field-input"
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={update("password")}
                placeholder="At least 6 chars"
              />
            </div>
            <div>
              <label className="field-label">Phone</label>
              <input
                className="field-input"
                required
                minLength={10}
                maxLength={15}
                value={form.phone}
                onChange={update("phone")}
                placeholder="10-digit number"
              />
            </div>
          </div>

          <div style={{ marginBottom: 22 }}>
            <label className="field-label">Address</label>
            <input className="field-input" required value={form.address} onChange={update("address")} placeholder="City, State" />
          </div>

          <button className="btn btn-accent" type="submit" disabled={busy} style={{ width: "100%" }}>
            {busy ? "Creating account…" : "Register"}
          </button>

          <p style={{ marginTop: 22, fontSize: "0.88rem", color: "var(--ink-soft)", textAlign: "center" }}>
            Already registered?{" "}
            <Link to="/login" style={{ color: "var(--marigold-deep)", fontWeight: 600, textDecoration: "none" }}>
              Log in
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
