import { app } from "./app";
import { ENDPOINT_URL, PORT } from "./constants";
import { readQuizCsv } from "./fetch";
import logger from "./util/logger";

function main() {
    logger.info("Service started");
    readQuizCsv();
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
