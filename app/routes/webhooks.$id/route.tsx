import { json, LoaderFunctionArgs } from "@remix-run/node";
import logger from "~/components/logger";

export async function loader({ params }: LoaderFunctionArgs) {
    const id = params.id;

    const logRequest = logger.child({ id });

    logRequest.info('🏃 starting processing webhook');

    logRequest.info('✅ completed processing webhook');

    return json({ message: "ok" })
}
