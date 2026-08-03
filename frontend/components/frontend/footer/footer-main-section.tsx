"use client";

import Link from "next/link";
import { useTranslations } from 'next-intl'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

const AddressSection = () => {
    const t = useTranslations('frontend')
    return (
        <address className="not-italic">
            <h3 className="hidden md:block mb-4 text-sm font-semibold uppercase tracking-wide">
                {t('footer.contacts')}
            </h3>

            <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                    <a
                    href="mailto:support@example.com"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground !no-underline !hover:no-underline"
                    >
                    support@example.com
                    </a>
                </li>
                <li>
                    <a
                    href="tel:+10000000000"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground !no-underline !hover:no-underline"
                    >
                    +1 (000) 000-0000
                    </a>
                </li>
                <li>
                    <div className="text-sm font-normal text-foreground">
                    {t('footer.working_hours')}
                    </div>
                    <div>Mon – Fri</div>
                    <div>09:00 – 18:00</div>
                </li>
            </ul>
        </address>
    )
}

export default function FooterMainSection() {
    const t = useTranslations('frontend')
    return (
        <>
            <section className="hidden md:block py-8">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {footerMainSections.map((section) => (
                        <nav key={section.title} aria-labelledby={`footer-${section.title}`}>
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
                                {t(`footer.${section.title}`)}
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
                        </nav>
                    ))}

                    <AddressSection />
                </div>
            </section>
            
            <section className="md:hidden py-6">
                <Accordion type="multiple" className="w-full space-y-3">
                    {footerMainSections.map((section) => (
                        <AccordionItem
                            key={section.title}
                            value={section.title}
                            className="overflow-hidden rounded-lg border bg-background"
                            >
                            <AccordionTrigger
                                className="
                                    px-4
                                    py-3
                                    text-sm
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    hover:no-underline"
                                >
                                {t(`footer.${section.title}`)}
                            </AccordionTrigger>

                            <AccordionContent className="border-t px-4 py-4">
                                <nav aria-labelledby={`footer-${section.title}`}>
                                    <ul className="space-y-3 pb-2">
                                        {section.links.map((link) => (
                                            <li key={link.href}>
                                                <Link
                                                    href={link.href}
                                                    className="text-sm text-muted-foreground !no-underline transition-colors hover:text-foreground !hover:no-underline"
                                                >
                                                    {t(`footer.${link.key}`)}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </AccordionContent>
                        </AccordionItem>
                    ))}

                    <AccordionItem value="contact" className="overflow-hidden rounded-lg border bg-background">
                        <AccordionTrigger
                            className="
                                px-4
                                py-3
                                text-sm
                                font-semibold
                                uppercase
                                tracking-wide
                                hover:no-underline"
                                >
                            {t("footer.contact")}
                        </AccordionTrigger>

                        <AccordionContent className="border-t px-4 py-4">
                            <AddressSection />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </>
    );
}
