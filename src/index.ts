import { app } from "./app";
import { ENDPOINT_URL, PORT } from "./constants";
import { quizFetcher, setupListener, testnetFetcher } from "./fetch";
import logger from "./util/logger";

function main() {
    logger.info("Service started");
    // Query every 2 minutes, since each query pulls all issue data
    setupListener(quizFetcher, 2 * 60 * 1000);
    // Query every 60 seconds
    setupListener(testnetFetcher, 60 * 1000);
}

app.listen(PORT, () =>
    logger.info(`interlay-crowdload-bonus-data is listening at ${ENDPOINT_URL}:${PORT}`)
);

try {
    if (!process.env.TYPEFORM_TOKEN) {
        logger.error("TYPEFORM_TOKEN not set in environment");
        process.exit(-1);
    }
    main();
} catch (error) {
    logger.error(error);
    process.exit(-1);
}
