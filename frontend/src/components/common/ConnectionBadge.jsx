import useHealthCheck from "../../hooks/useHealthCheck";

export default function ConnectionBadge() {

    const online = useHealthCheck();

    return (

        <span
            className={`px-3 py-1 rounded-full text-sm font-medium
            ${
                online
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
            }`}
        >
            {online ? "API Connected" : "API Disconnected"}
        </span>

    );

}