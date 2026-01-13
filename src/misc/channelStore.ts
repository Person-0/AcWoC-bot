import {
    Attachment,
    AttachmentBuilder,
    Message,
    TextChannel
} from "discord.js";

interface CacheData {
  [key: string]: string | CacheData;
}

export default class ChannelStore {
    cache: CacheData = {};
    channel: TextChannel;
    name: string;

    constructor(name: string, channel: TextChannel) {
        if (!(channel.isSendable() && channel.isTextBased())) {
            throw new Error(
                "ChannelStore: Channel is not sendable / text based!"
            );
        }

        channel.send("ChannelStore initialized");
        this.channel = channel;
        this.name = name;
        this.updateFromLast();
    }

    get = (key: string) => {
        return this.cache[key] || undefined;
    }

    set = (key: string, val: string | CacheData) => {
        this.cache[key] = val;
        this.save();
    }

    updateFromLast = async () => {
        const latestMessages = await this.channel.messages.fetch({
            limit: 25
        });

        const testMessageForAttachment = async (msg: Message) => {
            let attachment: Attachment | null = null;
            let message: Message | null = null;
            if (msg.attachments && msg.attachments.size > 0) {
                for (const [k, attachmentInMsg] of msg.attachments) {
                    if (attachmentInMsg.name === this.name) {
                        attachment = attachmentInMsg;
                        message = msg;
                    }
                    if (attachment) break;
                }
            } else if(msg.reference && msg.reference.messageId) {
                let repliedMessage: Message | null = null;
                try{
                    repliedMessage = await msg.channel.messages.fetch(
                        msg.reference.messageId
                    );
                } catch(e) {
                    repliedMessage = null;
                }
                if(repliedMessage) {
                    return testMessageForAttachment(repliedMessage);
                }
            }
            return { attachment, message }
        }

        let result;
        if (latestMessages) {
            for (const [k, msg] of latestMessages) {
                result = await testMessageForAttachment(msg);
                if (result.attachment && result.message) break;
            }
        }

        if (
            result &&
            result.attachment &&
            result.message
        ) {
            let errres = true;
            try {
                let res = await fetch(result.attachment.url);
                this.cache = await res.json() as CacheData;
                result.message.reply("Using this backup to update cache.");
                errres = false;
            } catch (e) {
                console.log(e);
            }
            if (!errres) return;
        }

        this.channel.send("Could not update cache! Last backup not found.");
    }

    save = async () => {
        const attachment = new AttachmentBuilder(
            Buffer.from(JSON.stringify(this.cache))
        );
        attachment.setName(this.name);
        await this.channel.send({
            content: "BACKUP: " + this.name,
            files: [attachment]
        });
    }
}