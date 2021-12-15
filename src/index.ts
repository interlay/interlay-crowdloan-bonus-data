import { app } from "./app";
import { ENDPOINT_URL, PORT } from "./constants";
import { getData, setData } from "./dataStore";
import { updateQuizResponses } from "./fetch";
import logger from "./util/logger";

function main() {
    logger.info("Service started");
    setInterval(
        async () => {
            updateQuizResponses(getData()).then(
                // Overwrite the old data
                (latestData) => setData(latestData)
            ).catch(error => {
                throw error;
            })
        },
        // Query every 60 seconds
        60 * 1000
    );
}

app.listen(PORT, () =>
    logger.info(`interlay-crowdload-quiz-data is listening at ${ENDPOINT_URL}:${PORT}`)
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
