function StatsCard({
  title,
  value,
  icon,
  color,
  lastUpdated,
}) {
  return (
    <div
      className={`${color} rounded-xl shadow-lg p-6 text-white`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-white/80">{title}</p>

          <h2 className="text-5xl font-bold mt-2">{value}</h2>

          <p className="text-xs text-white/70 mt-4">
            Last updated: {lastUpdated}
          </p>
        </div>

        <span className="text-5xl">{icon}</span>
      </div>
    </div>
  );
}

export default StatsCard;