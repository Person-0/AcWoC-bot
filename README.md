# AcWoC Discord Bot
<div>
	<img style="height: 50px" src="./assets/acwoc-icon.webp">
	<img style="height: 50px" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/2048px-Typescript_logo_2020.svg.png">
	<img style="height: 50px" src="https://avatars.githubusercontent.com/u/9950313?s=48&v=4">
	<img style="height: 50px" src="https://avatars.githubusercontent.com/u/26492485?s=48&v=4">
</div>
<br>
This is the source code of the AcWoC bot, made for AcWoC's Discord server.<br>
The bot supports both slash and text-based commands.

Text commands prefix: **`a.`**<br>
Sample usage: 
- **`a.<command_name>`**<br>
	or
- **`/command_name`**
<br><br>

# Commands

- `ping`
  - Shows the time it takes (in milliseconds) for the bot to send a message to discord.

- `forward <channel> <message content>`
  - Sends a text message supplied as an argument to the command to a channel also specified in the command.
  - Arguments:
    - ***channel*** can be any text channel's id or direct reference using #channel as long as the bot has permission to send messages in that channel.
    - ***message content*** limit is 2000 characters, but you should take a margin of ~33 characters since you will not be able to send the command if it exceeds the limit itself, unless you have nitro.
  - Aliases:
    `send`, `say`


# Running from Source
- Ensure you have NodeJS, npm installed.
- Clone this repository
- `cd` into the root of this repository
- Make a `.env` file with the following content:
    - ```dotenv
        PREFIX = "a."
        BTOKEN = "<YOUR BOT TOKEN>"
        CLIENTID = "<BOT APPLICATION ID>"
      ```
- Install dependencies:
    - ```bash
        npm i
      ```
        OR If you have pnpm installed
    - ```bash
        pnpm i
      ```
- Run the bot (dev):
    - ```bash
        npm start
      ```
- Production:
    - build command:
      ```bash
        npm run build
      ```
    - start command:
      ```bash
        npm run start:prod
      ```