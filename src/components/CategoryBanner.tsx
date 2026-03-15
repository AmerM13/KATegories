interface CategoryBannerProps {
  category: string;
}

export default function CategoryBanner({ category }: CategoryBannerProps) {
  return (
    <div className="mt-3">
      <div className="bg-kat-blue rounded-xl px-4 py-3 text-white text-center shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-kat-orange mb-1">
          Today's KATegory:
        </p>
        <p className="text-lg sm:text-xl font-black leading-snug">{category}</p>
      </div>
    </div>
  );
}
