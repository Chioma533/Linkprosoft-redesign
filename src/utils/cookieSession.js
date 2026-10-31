const AUTH_STORAGE_KEYS = ["token", "accessToken", "refreshToken", "user"];

export const clearPersistedAuth = (storage = localStorage) => {
  AUTH_STORAGE_KEYS.forEach((key) => storage.removeItem(key));
};

export const extractAuthenticatedUser = (body) =>
  body?.data?.user ?? body?.user ?? body?.data ?? null;

const endpoint = (apiBaseUrl, path) => `${apiBaseUrl.replace(/\/$/, "")}${path}`;

const requestSessionUser = async (fetchImpl, apiBaseUrl) => {
  const response = await fetchImpl(endpoint(apiBaseUrl, "/api/auth/me"), {
    credentials: "include",
  });

  if (!response.ok) {
    const error = new Error("Unable to verify the signed-in account");
    error.status = response.status;
    throw error;
  }

  const user = extractAuthenticatedUser(await response.json());
  if (!user) throw new Error("The signed-in account could not be loaded");
  return user;
};

// OAuth and regular session restoration both use HttpOnly cookies.  Deliberately
// omit headers here so a value left by an older bearer-token implementation can
// never override the session selected by the backend.
let activeSessionLookup = null;

export const getCookieSessionUser = (fetchImpl, apiBaseUrl) => {
  if (activeSessionLookup) return activeSessionLookup;

  activeSessionLookup = (async () => {
    try {
      return await requestSessionUser(fetchImpl, apiBaseUrl);
    } catch (error) {
      if (error.status !== 401) throw error;
    }

    const refreshResponse = await fetchImpl(endpoint(apiBaseUrl, "/api/auth/refresh-token"), {
      method: "POST",
      credentials: "include",
    });
    if (!refreshResponse.ok) {
      const error = new Error("Your sign-in session has expired");
      error.status = refreshResponse.status;
      throw error;
    }

    return requestSessionUser(fetchImpl, apiBaseUrl);
  })().finally(() => {
    activeSessionLookup = null;
  });

  return activeSessionLookup;
};
