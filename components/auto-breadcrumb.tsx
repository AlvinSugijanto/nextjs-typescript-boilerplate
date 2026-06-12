"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItemDef {
  label: string;
  href?: string;
}

interface AutoBreadcrumbProps {
  items?: BreadcrumbItemDef[];
}

/**
 * Auto-generates breadcrumbs from the current pathname.
 * Example: /dashboard/config → Dashboard › Config
 *
 * Pass `items` manually to override automatic generation.
 */
export function AutoBreadcrumb({ items }: AutoBreadcrumbProps) {
  const pathname = usePathname();

  // ── Manual items ──────────────────────────────────────────────────────────
  if (items && items.length > 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, idx) => (
            <React.Fragment key={idx}>
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {idx < items.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // ── Auto-generate from pathname ───────────────────────────────────────────
  const segments = (pathname ?? "")
    .split("/")
    .filter((seg) => seg.trim().length > 0);

  if (segments.length === 0) return null;

  const toTitle = (slug: string) =>
    slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const breadcrumbs: BreadcrumbItemDef[] = segments.map((seg, i) => ({
    label: toTitle(seg),
    href: "/" + segments.slice(0, i + 1).join("/"),
  }));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, idx) => (
          <React.Fragment key={item.href}>
            <BreadcrumbItem>
              {idx < breadcrumbs.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link href={item.href!}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {idx < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
