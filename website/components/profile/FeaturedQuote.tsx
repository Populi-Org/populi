interface FeaturedQuoteProps {
  quote: string;
  author: string;
  date: Date | null;
}

export default function FeaturedQuote({ quote, author, date }: FeaturedQuoteProps) {
  return (
    <div className="bg-secondary-fixed p-8 border-2 border-[#2F2F2F] tile-bevel crazing-overlay flex flex-col justify-center items-center text-center">
      <span className="text-4xl text-secondary/20 mb-4">&#10077;</span>
      <blockquote className="font-headline italic text-xl text-secondary max-w-2xl leading-snug">
        {quote}
      </blockquote>
      <div className="mt-6 flex items-center gap-4">
        <div className="h-px w-12 bg-secondary/30" />
        <span className="font-label text-xs uppercase tracking-widest text-on-secondary-fixed">
          {author.toUpperCase()}
        </span>
        <div className="h-px w-12 bg-secondary/30" />
      </div>
      {date && (
        <p className="font-label text-[10px] text-on-secondary-fixed/60 mt-2 uppercase tracking-wider">
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
