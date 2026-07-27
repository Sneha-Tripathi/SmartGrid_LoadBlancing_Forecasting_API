import { useEffect, useState } from "react";
import api from "../services/api";

export default function useHealthCheck() {

    const [online, setOnline] = useState(false);

    useEffect(() => {

        const check = async () => {

            try {

                await api.get("/");

                setOnline(true);

            }

            catch {

                setOnline(false);

            }

        };

        check();

        const interval = setInterval(check, 5000);

        return () => clearInterval(interval);

    }, []);

    return online;

}