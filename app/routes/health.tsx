import { json, LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ }: LoaderFunctionArgs) {
    return json({
        health: "I'm healthy 🐈"
    });
}
