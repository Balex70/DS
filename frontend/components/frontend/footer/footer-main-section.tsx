"use client";

import Link from "next/link";
import { useTranslations } from 'next-intl'

const footerMainSections = [
  {
    title: "company",
    links: [
      { key: "about_us", href: "/about" },
      { key: "contact_us", href: "/contact" },
    ],
  },
  {
    title: "customer_service",
    links: [
      { key: "faq", href: "/faq" },
      { key: "shipping_info", href: "/shipping" },
      { key: "returns_refunds", href: "/returns" },
      { key: "order_tracking", href: "/track-order" },
      { key: "payment_methods", href: "/payment-methods" },
    ],
  },
  {
    title: "legal",
    links: [
      { key: "privacy_policy", href: "/privacy-policy" },
      { key: "terms", href: "/terms" },
      { key: "cookie_policy", href: "/cookie-policy" },
    ],
  },
];

export default function FooterMainSection() {
    const t = useTranslations('frontend')
    return (
        <section className="py-10">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {footerMainSections.map((section) => (
                    <div key={section.title}>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
                            {t('footer.' + section.title)}
                        </h3>

                        <ul className="space-y-2">
                            {section.links.map((link) => (
                            <li key={link.href}>
                                <Link
                                href={link.href}
                                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                {t('footer.' + link.key)}
                                </Link>
                            </li>
                            ))}
                        </ul>
                    </div>
                ))}

                <div>
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
                    Contact
                    </h3>

                    <ul className="space-y-3 text-sm text-muted-foreground">
                    <li>
                        <a
                        href="mailto:support@example.com"
                        className="transition-colors hover:text-foreground"
                        >
                        support@example.com
                        </a>
                    </li>

                    <li>
                        <a
                        href="tel:+10000000000"
                        className="transition-colors hover:text-foreground"
                        >
                        +1 (000) 000-0000
                        </a>
                    </li>

                    <li>
                        <div className="font-medium text-foreground">
                        Working Hours
                        </div>
                        <div>Mon – Fri</div>
                        <div>09:00 – 18:00</div>
                    </li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
