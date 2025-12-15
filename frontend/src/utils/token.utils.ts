export interface TokenPayload {
  userId: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch (error) {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload) return true;

  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();

  return expirationTime <= currentTime;
}

export function getTokenExpirationTime(token: string): number | null {
  const payload = decodeToken(token);
  if (!payload) return null;

  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();

  return Math.max(0, expirationTime - currentTime);
}

export function saveToken(token: string): void {
  if (typeof window === "undefined") return;

  localStorage.setItem("token", token);

  const payload = decodeToken(token);
  if (payload) {
    const expirationDate = new Date(payload.exp * 1000);
    document.cookie = `token=${token}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`;
  }
}

export function saveRefreshToken(refreshToken: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("refreshToken", refreshToken);
}
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refreshToken");
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  return !isTokenExpired(token);
}
