import { logger } from "firebase-functions";
import * as fs from "fs";
import { Context, Telegraf } from "telegraf";
import Binance, { DailyStatsResult } from "binance-api-node";

interface MyContext extends Context {}

export class BotActions {
  private bot = new Telegraf<MyContext>(this.token);
  private coinSymbols: any[] = [];
  private binance = Binance();

  constructor(
    private token: string,
    private region: string,
    private projectId: string
  ) {
    logger.debug("Telegram webhook setting up...");
    this.bot.telegram.setWebhook(
      `https://${this.region}-${this.projectId}.cloudfunctions.net/api/crypto/bot${this.token}`
    );
    logger.debug(
      `Telegram webhook setting up success! ${this.region} ${this.projectId}`
    );
  }

  init() {
    try {
      this.readJson();
    } catch (error) {
      logger.error("Coins data json read error!", JSON.stringify(error));
    }

    this.bot.on("inline_query", async (ctx) => {
      try {
        if (ctx.inlineQuery.query.length > 2) {
          const query = ctx.inlineQuery.query.toUpperCase();
          const result = this.coinSymbols.filter((x) =>
            x.title.startsWith(query)
          );
          const livePrices: DailyStatsResult[] =
            (await this.binance.dailyStats()) as DailyStatsResult[];

          result.forEach(async (x) => {
            const stick = livePrices.find((y) => y.symbol === x.title);
            if (stick) {
              x.description = `Price: ${stick.lastPrice}`;
              x.input_message_content.message_text = `<b>${x.title}</b>
<b>Price:</b> ${stick.lastPrice}
<b>Open:</b> ${stick.openPrice}
<b>High:</b> ${stick.highPrice}
<b>Low:</b> ${stick.lowPrice}

<b>Change:</b> <code>${stick.priceChangePercent}%</code>`;
            }
          });

          await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result);
        } else {
          await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, []);
        }
      } catch (error) {
        logger.error("RESULT PRODUCE ERROR", JSON.stringify(error));
        await ctx.reply("Result produce error!");
      }
    });
  }

  async handleUpdate(update: any) {
    await this.bot.handleUpdate(update);
  }

  private readJson() {
    fs.readFile("./src/api/crypto/data.json", "utf8", (err, data) => {
      if (err) throw err;
      this.coinSymbols = JSON.parse(data).coins;
      logger.debug(this.coinSymbols);
    });
  }
}
