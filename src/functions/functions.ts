import crypto from "crypto";

export function deepCopy(object: [] | object) {
  return JSON.parse(JSON.stringify(object));
}

export function trimString(string: string, length: number) {
  if (string.length > length) {
    return string.substring(0, length) + "...";
  }

  return string;
}

export function generateRandomString(length: number) {
  const randomString = crypto.randomBytes(Math.ceil(length / 2)).toString("hex").slice(0, length);
  return randomString;
}

export function hashString(string: string) {
  const hash = crypto.createHash("sha256").update(string).digest("hex").split("").reverse().join("");
  return hash;
}

export function createSlug(string: string) {
  const slug = string.toLowerCase().replace(/[^a-zA-Z0-9 -]/g, "").replace(/\s+/g, "-");

  if (!slug) {
    return generateRandomString(10);
  }
  return slug;
}

export function formatDateTime(date: string) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const formattedTime = new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${formattedDate} ${formattedTime}`;
}

export function checkIfUserIsAdmin(user: any) {
  if (!user) {
    return false;
  }

  if (user.email === "abibekoli@gmail.com") {
    return true;
  }

  return false;
}