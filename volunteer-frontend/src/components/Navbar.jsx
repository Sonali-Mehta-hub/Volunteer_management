import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import WingMark from "./WingMark";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 32px",
        borderBottom: "1px solid var(--line)",
        background: "var(--paper-raised)",
      }}
    >
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <WingMark size={26} color="var(--marigold-deep)" />
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.15rem", color: "var(--ink)" }}>
          NayePankh
        </span>
        <span style={{ fontSize: "0.75rem", color: "var(--ink-soft)", marginLeft: 2 }}>Volunteer Management</span>
      </Link>

      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: "0.85rem", color: "var(--ink-soft)" }}>
            {user.name} · <span className={`badge badge-${user.role}`}>{user.role}</span>
          </span>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            Log out
          </button>
        </div>
      )}
    </header>
  );
}
