import express, { Response as ExResponse, Request as ExRequest } from "express";
import swaggerUi from "swagger-ui-express";
import pino from "express-pino-logger";
import bodyParser from "body-parser";

import logger from "./util/logger";
import { getData } from "./dataStore";

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

app.use("/quiz", async (req: ExRequest, res: ExResponse) => {
    if (!req.query || ! req.query.addresses) {
      return res.status(500).json("`addresses` parameter must be specified").send();
    }
    const addresses = (req.query.addresses as string).split(",");
    const data = getData();
    data.forEach(
        item => {
            if (addresses.includes(item.answers[0].text)) {
                return res.json({ quizBonus: true });
            }
        }
    );
    return res.json({ quizBonus: false });
});
