import { Link } from "react-router-dom";

function QuickActionButton({
  icon,
  title,
  color,
  to,
}) {
  return (
    <Link
      to={to}
      className={`${color} text-white rounded-lg px-6 py-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3`}
    >
      <span className="text-xl">
        {icon}
      </span>

      <span className="font-semibold">
        {title}
      </span>

    </Link>
  );
}

export default QuickActionButton;