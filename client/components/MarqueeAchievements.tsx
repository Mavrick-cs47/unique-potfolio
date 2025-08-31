export default function MarqueeAchievements() {
  const items = [
    "Hackathon Winner",
    "Dean's List",
    "Top 1% LeetCode",
    "Open Source Contributor",
    "Published Research",
    "AWS Certified",
    "Google DSC Lead",
  ];
  return (
    <div className="marquee py-6 glass">
      <div className="marquee-track flex items-center gap-10 px-6 text-sm md:text-base">
        {items.concat(items).map((it, i) => (
          <span key={i} className="px-4 py-2 rounded-full border border-white/20 bg-white/5">
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
