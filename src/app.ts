import express, { Response as ExResponse, Request as ExRequest } from "express";
import swaggerUi from "swagger-ui-express";
import pino from "express-pino-logger";
import bodyParser from "body-parser";

import logger from "./util/logger";
import { addressCompletedQuiz, getTestnetData } from "./dataStore";

export const app = express();

app.use(pino({ logger }))
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use((_, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// application is alive
app.get("/health", (_, res) => {
    res.json({})
});

app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(
    swaggerUi.generateHTML(await import("./swagger.json"))
  );
});

app.use("/bonus", async (req: ExRequest, res: ExResponse) => {
  if (!req.query || ! req.query.addresses) {
    return res.status(500).json("`addresses` parameter must be specified").send();
  }
  const addresses = (req.query.addresses as string).split(",");
  return res.json({
    // did any address complete the quiz?
    quizBonus: addresses.map(addressCompletedQuiz).reduce((sum, next) => sum || next, false),
    testnetBonus: !!getTestnetData().data.find(item => addresses.includes(item.userParachainAddress))
  });
});
