import ProfileSection from "./ProfileSection";

interface FeaturedQuoteProps {
  quote: string | null;
  date: Date | null;
}

export default function FeaturedQuote({ quote, date }: FeaturedQuoteProps) {
  if (!quote) return null;

  return (
    <ProfileSection variant="primary" className="p-6 md:p-10">
      <div className="relative">
        <span className="font-headline text-6xl text-on-primary-container/20 absolute -top-4 -left-2 select-none">
          &ldquo;
        </span>
        <blockquote className="font-body text-lg md:text-xl text-on-primary-container leading-relaxed pl-6 border-l-2 border-stone-900">
          {quote}
        </blockquote>
        {date && (
          <p className="font-label text-xs text-on-primary-container/60 mt-4 uppercase tracking-wider">
            {new Date(date).toLocaleDateString("pt-PT", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>
    </ProfileSection>
  );
}
