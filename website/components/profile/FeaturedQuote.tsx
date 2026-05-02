import { Quote } from "lucide-react";

interface FeaturedQuoteProps {
  quote: string;
  author: string;
  date: Date | null;
}

export default function FeaturedQuote({ quote, author, date }: FeaturedQuoteProps) {
  return (
    <div className="bg-secondary-fixed p-8 border-2 border-[#2F2F2F] tile-bevel crazing-overlay flex flex-col justify-center items-center text-center">
      <Quote className="w-10 h-10 text-primary mb-4" strokeWidth={0} fill="currentColor" />
      <blockquote className="font-headline italic text-xl text-primary max-w-2xl leading-snug">
        {quote}
      </blockquote>
      <div className="mt-6 flex items-center gap-4">
        <div className="h-px w-12 bg-primary/30" />
        <span className="font-label text-xs uppercase tracking-widest text-primary">
          {author.toUpperCase()}
        </span>
        <div className="h-px w-12 bg-primary/30" />
      </div>
      {date && (
        <p className="font-label text-[10px] text-primary/60 mt-2 uppercase tracking-wider">
          {new Date(date).toLocaleDateString("pt-PT", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}
    </div>
  );
}
