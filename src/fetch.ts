const csv = require('csv-parser')
const fs = require('fs')

import axios from "axios";
import { getQuizData, QuizData, setQuizData, setTestnetData } from "./dataStore";
import logger from "./util/logger";

export const updateQuizResponses = async (quizResponses: QuizData = { data: [] }) => {
    function getQuizParams(since?: string): Record<string, string | number | undefined> {
      return {
        // 1000 is the maximum allowed by the TypeForm API
        page_size: 1000,
        // The two comma-separated `fields` are the TypeForm IDs of the following columns:
        // - "You've finished the quiz and scored full marks!" (Aqkwhf1nRZRt)
        // - "完成测试，满分！" (pmWHGnNVycLi)
        fields: 'Aqkwhf1nRZRt,pmWHGnNVycLi',
        answered_fields: 'Aqkwhf1nRZRt,pmWHGnNVycLi',
        sort: 'submitted_at,asc',
        since
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
      let since = quizResponses.data.length ? quizResponses.data[quizResponses.data.length - 1].submitted_at : undefined;
      if (since) {
          logger.info(`Querying after: ${since}`);
      }
      const res = await axiosInstance
          .get('/forms/njQ3hmXY/responses', {
            params: getQuizParams(since)
      });
      quizResponses.data = quizResponses.data.concat(res.data.items);
      if (res.data.page_count === 1) {
          break;
      }
      logger.info(`Remaining pages ${res.data.page_count - 1}`);
    }
    logger.info(`Fetched a total of ${quizResponses.data.length} responses`);
    return quizResponses;
};

export const getExecutedIssues = async (): Promise<any[]> => {
  logger.info("Fetching new completed issue requests...");
  const axiosInstance = axios.create({
    baseURL: 'https://api-kusama.interlay.io',
    timeout: 60000,
  });

  const res = await axiosInstance
    .post('/stats/issues', [{
      "comparison": "=",
      "value": "true",
      "column": "executed"
    }]);
  logger.info(`Total executed issues: ${res.data.length}`);
  return res.data;
};

export const readQuizCsv = () => {
  const results: any[] = [];
  fs.createReadStream('./data/crowdloan_quiz_responses.csv')
    .pipe(csv())
    .on('data', (data: any) => results.push(data));
  setQuizData({ data: results });
}

export const quizFetcher = () => {
  updateQuizResponses(getQuizData()).then(
      // Overwrite the old data
      (latestData) => setQuizData(latestData)
  ).catch(error => {
      throw error;
  })
}

export const testnetFetcher = () => {
  getExecutedIssues()
      .then(executedIssueData => setTestnetData({
          data: executedIssueData
      })).catch(error => {
          throw error;
      })
}

export const setupListener = (fn: () => void, milliseconds: number) => {
  // Call manually once, to fetch data on service startup
  fn();
  if (process.env.UPDATE_FROM_TESTNET === '1') {
    setInterval(
        async () => fn(),
        milliseconds
    );
  }
}

// Unused
export const getTotalIssueRequests = async (): Promise<number> => {
  logger.info("Checking if there are new issue requests...");
  const axiosInstance = axios.create({
    baseURL: 'https://api-kusama.interlay.io',
    timeout: 60000,
  });

  const res = await axiosInstance
    .get('/stats/issues/total');
  logger.info(`Total issue requests: ${res.data}`);
  return res.data;
};

