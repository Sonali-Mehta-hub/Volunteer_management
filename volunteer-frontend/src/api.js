const BASE_URL = "http://127.0.0.1:8000";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data.detail || "Something went wrong. Please try again.";
    throw new Error(typeof message === "string" ? message : JSON.stringify(message));
  }

  return data;
}

export const api = {
  register: (payload) => request("/register", { method: "POST", body: payload }),
  login: (payload) => request("/login", { method: "POST", body: payload }),
  getMe: (token) => request("/me", { token }),
  listVolunteers: (token) => request("/admin/volunteers", { token }),
  updateStatus: (token, id, status) =>
    request(`/admin/volunteers/${id}/status`, { method: "PATCH", body: { status }, token }),
  updateRole: (token, id, role) =>
    request(`/admin/volunteers/${id}/role`, { method: "PATCH", body: { role }, token }),
  deleteVolunteer: (token, id) =>
    request(`/admin/volunteers/${id}`, { method: "DELETE", token }),
};
