import axios from "axios";
import logger from "./util/logger";

export const updateQuizResponses = async (quizResponses: any[] = []) => {
    function getQuizParams(sinceToken?: string): Record<string, string | number | undefined> {
      return {
        page_size: 1000,
        fields: 'Aqkwhf1nRZRt,pmWHGnNVycLi',
        answered_fields: 'Aqkwhf1nRZRt,pmWHGnNVycLi',
        sort: 'submitted_at,asc',
        since: sinceToken
      };
    }

    logger.info("Pulling existing quiz responses");
    const axiosInstance = axios.create({
      baseURL: 'https://api.typeform.com',
      timeout: 30000,
      headers: { Authorization: `Bearer ${process.env.TYPEFORM_TOKEN}` }
    });

    // Only stop requesting when we reached the last page
    // eslint-disable-next-line no-constant-condition
    while (true) {
        let sinceToken = quizResponses.length ? quizResponses[quizResponses.length - 1].submitted_at : undefined;
        if (sinceToken) {
            logger.info(`Querying after: ${sinceToken}`);
        }
        const res = await axiosInstance
            .get('/forms/njQ3hmXY/responses', {
             params: getQuizParams(sinceToken)
        });
        quizResponses = quizResponses.concat(res.data.items);
        if (res.data.page_count === 1) {
            break;
        }
        logger.info(`Remaining pages ${res.data.page_count - 1}`);
    }
    logger.info(`Fetched a total of ${quizResponses.length} responses`);
    return quizResponses;
};