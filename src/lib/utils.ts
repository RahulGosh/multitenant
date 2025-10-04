// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTenantUrl(tenantSlug: string) {
  return `/tenants/${tenantSlug}`;
}

// For server-side usage, create a separate server-only utility
export const serverGenerateAuthCookie = async (
  prefix: string,
  value: string
) => {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.set({
    name: `${prefix}-token`,
    value: value,
    httpOnly: true,
    path: "/",
  });
};

// For client-side usage
export const clientGenerateAuthCookie = (prefix: string, value: string) => {
  if (typeof document !== "undefined") {
    document.cookie = `${prefix}-token=${value}; path=/;`;
  }
};

// Maintain the original interface but with a different implementation
interface Props {
  prefix: string;
  value: string;
}

export const generateAuthCookie = async ({ prefix, value }: Props) => {
  if (typeof window !== "undefined") {
    // Client-side
    clientGenerateAuthCookie(prefix, value);
  } else {
    // Server-side
    await serverGenerateAuthCookie(prefix, value);
  }
};

export function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value));
}
