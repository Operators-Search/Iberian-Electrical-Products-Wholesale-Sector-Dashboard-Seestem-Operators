import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import Link from "next/link";
import { getMessages, type Locale } from "@/lib/i18n";

const LOGO_CANDIDATES = [
  "seestem-logo.svg",
  "seestem-logo.png",
  "seestem-logo.webp",
  "seestem-logo.jpg",
  "seestem-logo.jpeg",
] as const;

function getLogoSource() {
  for (const fileName of LOGO_CANDIDATES) {
    if (existsSync(join(process.cwd(), "public", "brand", fileName))) {
      return `/brand/${fileName}`;
    }
  }

  return null;
}

function FallbackWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        className={compact ? "h-9 w-9 shrink-0" : "h-11 w-11 shrink-0"}
        fill="none"
      >
        <rect x="9" y="9" width="18" height="18" rx="3" transform="rotate(45 9 9)" stroke="#2196F3" strokeWidth="3" />
        <rect x="21" y="21" width="18" height="18" rx="3" transform="rotate(45 21 21)" stroke="#26A69A" strokeWidth="3" />
        <circle cx="24" cy="24" r="2.5" fill="#2196F3" />
      </svg>
      <div className="leading-none">
        <div className={compact ? "text-[0.95rem] font-bold tracking-tight text-[var(--foreground)]" : "text-[1.05rem] font-bold tracking-tight text-[var(--foreground)]"}>SEESTEM</div>
        <div className={compact ? "mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]" : "mt-1 text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]"}>
          Operators
        </div>
      </div>
    </div>
  );
}

export function BrandLockup({
  locale,
  variant = "card",
}: {
  locale: Locale;
  variant?: "card" | "inline";
}) {
  const logoSource = getLogoSource();
  const copy = getMessages(locale);
  const logo = logoSource ? (
    <Image
      src={logoSource}
      alt="SEESTEM Operators"
      width={variant === "inline" ? 190 : 220}
      height={variant === "inline" ? 52 : 60}
      className={variant === "inline" ? "h-auto w-full max-w-[190px]" : "h-auto w-full max-w-[220px]"}
      priority
    />
  ) : (
    <FallbackWordmark compact={variant === "inline"} />
  );

  if (variant === "inline") {
    return (
      <div className="space-y-2">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
          {copy.brand.poweredBy}
        </p>
        <Link
          href="https://seestem.eu/es"
          target="_blank"
          rel="noreferrer"
          aria-label="Open SEESTEM website in a new tab"
          className="block rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.82)] px-4 py-3 shadow-[var(--shadow)] transition hover:border-[var(--accent)] hover:bg-[rgba(255,255,255,0.96)]"
        >
          {logo}
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(33,150,243,0.08),rgba(38,166,154,0.08))] p-4 shadow-[var(--shadow)]">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
        {copy.brand.poweredBy}
      </p>
      <div className="mt-3">{logo}</div>
    </div>
  );
}
