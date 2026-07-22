export default function ErrorMessage({ message }) {

    return (

        <div className="rounded-xl border border-red-500 bg-red-500/10 p-4 text-red-400">

            {message}

        </div>

    );

}