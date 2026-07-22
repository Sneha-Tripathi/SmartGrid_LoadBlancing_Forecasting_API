import { FaWifi } from "react-icons/fa";

export default function NetworkError() {

  return (

    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 text-center">

      <FaWifi className="mx-auto text-4xl text-yellow-400 mb-4" />

      <h2 className="text-yellow-300 text-xl font-semibold">
        Network Error
      </h2>

      <p className="text-slate-300 mt-3">
        Unable to connect to backend server.
      </p>

      <p className="text-slate-500 mt-2 text-sm">
        Please make sure FastAPI is running.
      </p>

    </div>

  );

}