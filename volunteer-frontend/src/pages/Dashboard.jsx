import Navbar from "../components/Navbar";
import WingMark from "../components/WingMark";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
        <div className="wing-divider">
          <WingMark />
          <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Your profile
          </span>
        </div>

        <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>Hi, {user.name.split(" ")[0]}</h1>
        <p style={{ color: "var(--ink-soft)", marginBottom: 32 }}>
          Here's where things stand with your volunteer account.
        </p>

        <div className="card" style={{ padding: 28, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <h3 style={{ fontSize: "1.1rem" }}>Account status</h3>
            <span className={`badge badge-${user.status}`}>{user.status}</span>
          </div>

          {user.status === "pending" && (
            <p style={{ color: "var(--ink-soft)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              Your application is awaiting review by an administrator. You'll gain full
              access once it's approved.
            </p>
          )}
          {user.status === "approved" && (
            <p style={{ color: "var(--ink-soft)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              You're an approved volunteer. Thank you for being part of NayePankh.
            </p>
          )}
          {user.status === "rejected" && (
            <p style={{ color: "var(--ink-soft)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              Your application was not approved. Contact an administrator for details.
            </p>
          )}
        </div>

        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: 18 }}>Your details</h3>
          <dl style={{ display: "grid", gridTemplateColumns: "140px 1fr", rowGap: 14, fontSize: "0.92rem" }}>
            <dt style={{ color: "var(--ink-soft)" }}>Email</dt>
            <dd style={{ margin: 0 }}>{user.email}</dd>
            <dt style={{ color: "var(--ink-soft)" }}>Phone</dt>
            <dd style={{ margin: 0 }}>{user.phone}</dd>
            <dt style={{ color: "var(--ink-soft)" }}>Address</dt>
            <dd style={{ margin: 0 }}>{user.address}</dd>
            <dt style={{ color: "var(--ink-soft)" }}>Role</dt>
            <dd style={{ margin: 0 }}>
              <span className={`badge badge-${user.role}`}>{user.role}</span>
            </dd>
          </dl>
        </div>
      </main>
    </div>
  );
}
