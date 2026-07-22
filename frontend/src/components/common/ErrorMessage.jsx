export default function ErrorMessage({
  title = "Something went wrong",
  message = "Unable to load data.",
}) {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">

      <h2 className="text-red-400 text-xl font-semibold">
        {title}
      </h2>

      <p className="text-slate-300 mt-2">
        {message}
      </p>

    </div>
  );
}