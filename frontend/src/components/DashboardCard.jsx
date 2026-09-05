import { Link } from "react-router-dom";

function DashboardCard({
  title,
  description,
  icon,
  color,
  to,
}) {
  return (
    <Link
      to={to}
      aria-label={`Open ${title}`}
      className={`
        ${color}
        group
        rounded-xl
        shadow-lg
        hover:shadow-2xl
        hover:-translate-y-1
        transition-all
        duration-300
        text-white
        p-5
        min-h-47.5
        flex
        flex-col
      `}
    >
      {/* Icon +Text*/}
      <div className="flex items-start gap-4">

        <div className="bg-white/20 p-3 rounded-lg text-3xl">
          {icon}
        </div>


        <div>
          <h2 className="text-xl font-bold leading-6 min-h-12.25">
            {title}
          </h2>

          <p className="text-white/90 mt-1 text-sm leading-5">
            {description}
          </p>

        </div>

      </div>

{/* Bottom Text */}
      <div className="mt-auto pt-4 flex justify-between items-center">

        <div className="text-sm text-white/80">
          Manage your data
        </div>


        <span className="
          font-medium
          group-hover:translate-x-1
          transition-transform
        ">
          Open →
        </span>


      </div>


    </Link>
  );
}

export default DashboardCard;