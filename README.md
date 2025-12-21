# AcWoc Bot

This is the source code of the AcWoC bot, made for AcWoC's Discord server.

# Usage
- Ensure you have NodeJS, npm installed.
- Clone this repository
- `cd` into the root of this repository
- Make a `.env` file with the following content:
    - ```dotenv
        PREFIX = "ac."
        BTOKEN = "<YOUR DISCORD BOT TOKEN>"
      ```
- Install dependencies:
    - ```bash
        npm i
      ```
        OR If you have pnpm installed
    - ```bash
        pnpm i
      ```
- Run the bot:
    - ```bash
        npm start
      ```