import { app } from "./app";
import { ENDPOINT_URL, PORT } from "./constants";
import { readQuizCsv, setupListener, testnetFetcher } from "./fetch";
import logger from "./util/logger";

function main() {
    logger.info("Service started");
    readQuizCsv();

    // Query every 60 seconds
    setupListener(testnetFetcher, 300 * 1000);
}

app.listen(PORT, () =>
    logger.info(`interlay-crowdload-bonus-data is listening at ${ENDPOINT_URL}:${PORT}`)
);

try {
    main();
} catch (error) {
    logger.error(error);
    process.exit(-1);
}
