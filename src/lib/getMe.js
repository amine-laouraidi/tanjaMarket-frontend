import { cache } from "react";

import { authFetch } from "./authFetch";

const getMe = async () => {
  const res = await authFetch("/users/me");
  if (!res) return null;
  return res.json();
};

export default getMe;
