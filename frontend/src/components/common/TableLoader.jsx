export default function TableLoader() {

  return (

    <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6">

      <div className="h-6 w-52 bg-slate-700 rounded mb-6 animate-pulse"></div>

      <div className="space-y-4">

        {[1,2,3,4,5].map((row) => (

          <div
            key={row}
            className="grid grid-cols-5 gap-4 animate-pulse"
          >

            <div className="h-5 rounded bg-slate-700"></div>

            <div className="h-5 rounded bg-slate-700"></div>

            <div className="h-5 rounded bg-slate-700"></div>

            <div className="h-5 rounded bg-slate-700"></div>

            <div className="h-5 rounded bg-slate-700"></div>

          </div>

        ))}

      </div>

    </div>

  );

}