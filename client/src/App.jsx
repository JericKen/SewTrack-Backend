import { useEffect } from "react";
import api from "./api/axios";

export default function App() {

    useEffect(() => {

        async function testBackend() {

            try {

                const response = await api.get("/health");

                console.log(response.data);

            } catch (error) {

                console.error(error);

            }

        }

        testBackend();

    }, []);

    return (
        <h1>SewTrack Frontend</h1>
    );

}