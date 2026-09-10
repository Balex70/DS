import { useTranslations } from 'next-intl'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
    {
        question: 'footer.faq_section.question_1.question',
        answer: 'footer.faq_section.question_1.answer',
    },
    {
        question: 'footer.faq_section.question_2.question',
        answer: 'footer.faq_section.question_2.answer',
    },
    {
        question: 'footer.faq_section.question_3.question',
        answer: 'footer.faq_section.question_3.answer',
    },
    {
        question: 'footer.faq_section.question_4.question',
        answer: 'footer.faq_section.question_4.answer',
    },
    {
        question: 'footer.faq_section.question_5.question',
        answer: 'footer.faq_section.question_5.answer',
    },
    {
        question: 'footer.faq_section.question_6.question',
        answer: 'footer.faq_section.question_6.answer',
    },
];

export function FAQComponent() {
    const t = useTranslations('frontend')

    return (
        <div className="mx-auto max-w-5xl py-4 lg:py-10">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold">
                    {t('footer.faq_section.header')}
                </h1>

                <p className="mt-4 text-muted-foreground">
                    {t('footer.faq_section.description')}
                </p>
            </div>

            <Accordion
                type="single"
                collapsible
                className="space-y-3"
            >
                {faqs.map((faq, index) => (
                    <AccordionItem
                        key={index}
                        value={`faq-${index}`}
                        className="overflow-hidden rounded-lg border"
                    >
                        <AccordionTrigger className="px-5 py-4 text-left font-medium hover:no-underline">
                            {t(faq.question)}
                        </AccordionTrigger>

                        <AccordionContent className="border-t px-5 py-4 text-muted-foreground">
                            {t(faq.answer)}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
