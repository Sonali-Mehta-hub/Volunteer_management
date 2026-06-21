import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import WingMark from "../components/WingMark";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";

export default function AdminPanel() {
  const { token } = useAuth();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [filter, setFilter] = useState("all");

  const load = () => {
    setLoading(true);
    api
      .listVolunteers(token)
      .then(setVolunteers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const withBusy = async (id, fn) => {
    setBusyId(id);
    setError("");
    try {
      await fn();
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const counts = volunteers.reduce(
    (acc, v) => ({ ...acc, [v.status]: (acc[v.status] || 0) + 1 }),
    { pending: 0, approved: 0, rejected: 0, suspended: 0 }
  );

  const visible = filter === "all" ? volunteers : volunteers.filter((v) => v.status === filter);

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: 980, margin: "0 auto", padding: "48px 24px" }}>
        <div className="wing-divider">
          <WingMark />
          <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Admin panel
          </span>
        </div>

        <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>Volunteers</h1>
        <p style={{ color: "var(--ink-soft)", marginBottom: 28 }}>
          Review applications and manage volunteer accounts.
        </p>

        {error && <div className="error-banner">{error}</div>}

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 32 }} className="stats-grid">
          {[
            { key: "pending", label: "Pending review" },
            { key: "approved", label: "Approved" },
            { key: "rejected", label: "Rejected" },
            { key: "suspended", label: "Suspended" },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => setFilter(filter === s.key ? "all" : s.key)}
              className="card"
              style={{
                padding: "18px 20px",
                textAlign: "left",
                border: filter === s.key ? "1px solid var(--marigold-deep)" : "1px solid var(--line)",
                background: filter === s.key ? "var(--amber-soft)" : "var(--paper-raised)",
              }}
            >
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 600 }}>
                {counts[s.key] || 0}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--ink-soft)", marginTop: 2 }}>{s.label}</div>
            </button>
          ))}
        </div>

        {filter !== "all" && (
          <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }} onClick={() => setFilter("all")}>
            Clear filter ({filter})
          </button>
        )}

        {loading ? (
          <p style={{ color: "var(--ink-soft)" }}>Loading volunteers…</p>
        ) : visible.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--ink-soft)" }}>
            No volunteers to show here.
          </div>
        ) : (
          <div className="card" style={{ overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)" }}>
                  {["Name", "Contact", "Status", "Role", "Actions"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "12px 16px",
                        fontSize: "0.72rem",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        color: "var(--ink-soft)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((v) => (
                  <tr key={v._id} style={{ borderBottom: "1px solid var(--line)" }}>
                    <td style={{ padding: "14px 16px", fontWeight: 600 }}>{v.name}</td>
                    <td style={{ padding: "14px 16px", color: "var(--ink-soft)" }}>
                      <div>{v.email}</div>
                      <div style={{ fontSize: "0.8rem" }}>{v.phone}</div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span className={`badge badge-${v.status}`}>{v.status}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span className={`badge badge-${v.role}`}>{v.role}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {v.status !== "approved" && (
                          <button
                            className="btn btn-sm btn-accent"
                            disabled={busyId === v._id}
                            onClick={() => withBusy(v._id, () => api.updateStatus(token, v._id, "approved"))}
                          >
                            Approve
                          </button>
                        )}
                        {v.status !== "rejected" && (
                          <button
                            className="btn btn-sm btn-ghost"
                            disabled={busyId === v._id}
                            onClick={() => withBusy(v._id, () => api.updateStatus(token, v._id, "rejected"))}
                          >
                            Reject
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-ghost"
                          disabled={busyId === v._id}
                          onClick={() =>
                            withBusy(v._id, () => api.updateRole(token, v._id, v.role === "admin" ? "volunteer" : "admin"))
                          }
                        >
                          {v.role === "admin" ? "Demote" : "Make admin"}
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          disabled={busyId === v._id}
                          onClick={() => {
                            if (confirm(`Delete ${v.name}? This cannot be undone.`)) {
                              withBusy(v._id, () => api.deleteVolunteer(token, v._id));
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <style>{`
        @media (max-width: 720px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
