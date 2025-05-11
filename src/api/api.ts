const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || res.statusText);
  }
  return res.json();
}

export function postService<T>(data: T): Promise<{ message: string; data: T }> {
  return fetch(`${BASE_URL}/service`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => handleResponse<{ message: string; data: T }>(res));
}

export function postVacancy<T>(data: T): Promise<{ message: string; data: T }> {
  return fetch(`${BASE_URL}/vacancy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => handleResponse<{ message: string; data: T }>(res));
}
