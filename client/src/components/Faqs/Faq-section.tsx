import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import faqData, { FaqItemType } from "@/data/faqs";

interface FaqItemProps {
  item: FaqItemType;
  index: number;
  value?: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ item, index, value }) => {
  const { t } = useTranslation("faq");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: "easeOut",
      }}
    >
      <AccordionItem
        value={value || `item-${index}`}
        className="border-b border-gray-200"
      >
        <AccordionTrigger className="text-left font-medium py-4 hover:no-underline">
          <motion.span
            initial={{ color: "#000" }}
            whileHover={{ color: "#3B82F6" }}
            transition={{ duration: 0.2 }}
          >
            {t(item.questionKey)}
          </motion.span>
        </AccordionTrigger>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <AccordionContent className="mt-2 text-gray-700 pb-4">
            {t(item.answerKey)}
          </AccordionContent>
        </motion.div>
      </AccordionItem>
    </motion.div>
  );
};

//FAQ Column
interface FaqColumnProps {
  items: FaqItemType[];
  defaultValue?: string;
  columnIndex: number;
}

const FaqColumn: React.FC<FaqColumnProps> = ({
  items,
  defaultValue,
  columnIndex,
}) => {
  return (
    <motion.div
      className="w-full md:w-1/2 lg:w-1/2 px-4"
      initial={{ opacity: 0, x: columnIndex === 0 ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.1 + columnIndex * 0.2,
        ease: "easeOut",
      }}
    >
      <Accordion
        type="single"
        collapsible
        defaultValue={defaultValue}
        className="w-full"
      >
        {items.map((item, index) => (
          <FaqItem
            key={`faq-item-${index}`}
            item={item}
            index={index}
            value={`item-${columnIndex}-${index}`}
          />
        ))}
      </Accordion>
    </motion.div>
  );
};

// Main FAQ Section component
const FaqSection: React.FC = () => {
  const faqColumn1 = faqData.slice(0, Math.ceil(faqData.length / 2));
  const faqColumn2 = faqData.slice(Math.ceil(faqData.length / 2));
  const { t } = useTranslation();
  return (
    <section className="bg-gray-50 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="maxScreen mx-auto shadow-sm border-0">
          <CardHeader className="pb-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CardTitle className="text-2xl font-semibold">
                {t("flight_booking_faq")}
              </CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap -mx-4">
              <FaqColumn items={faqColumn1} columnIndex={0} />
              <FaqColumn items={faqColumn2} columnIndex={1} />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};

export default FaqSection;
