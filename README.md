## Binance Telegram Bot!

This is an inline telegram bot created using expressJs. This will let you get the latest price details of a day candle stick. You can get the current, opening, highest, lowest and the change details by giving the coin or token symbol to the inline bot. The API is written to deploy to a firebase function. Feel free to pull and edit as you need and deploy to your own project.
**Credits:** Telegraf, binance-api-node

## Getting Started

1.  Clone the repo
    ```
    git clone https://github.com/madumal7/binance-telegram-bot.git
    ```
2.  Install NPM packages
    ```
    npm install
    ```
3.  Create an inline telegram bot using BotFather. Read the documentation [here](https://core.telegram.org/bots/api#inline-mode).
4.  Add following variables as your firebase environment variables.

    ```
    {
        "crypto": {
            "token": <YOUR_TELEGRAM_BOT_TOKEN>,
            "projectid": <YOUR_FIREBASE_PROJECT_ID>,
            "region": <YOUR_FIREBASE_PROJECT_REGION>
        }
    }
    ```

5.  Run `npm run deploy` to build and deploy the function to firebase
    Once you deploy the bot to your firebase function, the webhook will be set to your inline bot.

## Usage

You can simply access your bot in inline queries of any of your telegram chats.
Normally it will be something like this

```
<bot_name>_bot BTC
```

## Motivation

I normally use telegram all the time for my works. When I'm busy, it's easy to know the price and the rest of the details of the latest candle with a single message on telegram.
