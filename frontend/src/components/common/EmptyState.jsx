import { FaInbox } from "react-icons/fa";

export default function EmptyState({

  title = "No Data Available",

  description = "No records found."

}) {

  return (

    <div className="flex flex-col items-center justify-center py-20">

      <FaInbox className="text-5xl text-slate-600 mb-5" />

      <h2 className="text-xl font-semibold text-white">
        {title}
      </h2>

      <p className="text-slate-400 mt-2">
        {description}
      </p>

    </div>

  );

}