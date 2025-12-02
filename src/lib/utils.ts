// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTenantUrl(tenantSlug: string) {
  const isDevelopment = process.env.NODE_ENV === "development";
  const isSubdomainRoutingEnabled = process.env.NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING! === "true"

  if (isDevelopment || !isSubdomainRoutingEnabled) {
    return `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${tenantSlug}`;
  }

  const protocol = "https";
  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

  return `${protocol}://${tenantSlug}.${domain}`;
}

// export function generateTenantUrl(tenantSlug: string) {
//   let protocol = "https";
//   const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

//   if (process.env.NODE_ENV === "development") {
//     protocol = "http"
//    }

//   // http://rahul.funroad.com
//   return `${protocol}://${tenantSlug}.${domain}`;
// }

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
