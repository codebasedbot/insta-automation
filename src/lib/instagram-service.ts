import axios from 'axios';
import { InstagramWebhookEvent } from './types';

const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

if (!INSTAGRAM_ACCESS_TOKEN) {
    console.warn('INSTAGRAM_ACCESS_TOKEN is not defined');
}

export async function sendDM(recipientId: string, text: string) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v21.0/me/messages`,
            {
                recipient: { id: recipientId },
                message: { text },
            },
            {
                params: {
                    access_token: INSTAGRAM_ACCESS_TOKEN,
                },
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error sending DM:', error.response?.data || error.message);
        } else {
            console.error('Error sending DM:', error);
        }
        throw error;
    }
}

export async function replyToComment(commentId: string, text: string) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v21.0/${commentId}/replies`,
            {
                message: text
            },
            {
                params: {
                    access_token: INSTAGRAM_ACCESS_TOKEN
                }
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error replying to comment:', error.response?.data || error.message);
        } else {
            console.error('Error replying to comment:', error);
        }
        throw error;
    }
}

export async function processInstagramEvent(event: InstagramWebhookEvent) {
    for (const entry of event.entry) {
        // Handle Messages
        if (entry.messaging) {
            for (const messageEvent of entry.messaging) {
                if (messageEvent.message && !messageEvent.message.is_echo) {
                    const senderId = messageEvent.sender.id;
                    const text = messageEvent.message.text;
                    console.log(`Received message from ${senderId}: ${text}`);

                    // Auto-reply logic
                    await sendDM(senderId, `You said: "${text}". This is an auto-reply.`);
                }
            }
        }

        // Handle Changes (Comments)
        if (entry.changes) {
            for (const change of entry.changes) {
                if (change.field === 'comments') {
                    const comment = change.value;
                    const senderId = comment.from.id;
                    const commentId = comment.id;
                    const text = comment.text;
                    console.log(`Received comment from ${senderId}: ${text}`);

                    // Auto-reply to comment with a DM (Private Reply) or Public Reply
                    try {
                        await sendDM(senderId, `Thanks for your comment: "${text}". We sent you this DM!`);
                    } catch (e) {
                        console.log("Could not send DM to commenter, maybe they are not a follower or privacy settings block it.", e);
                        // Fallback: Reply to the comment publicly
                        await replyToComment(commentId, "Thanks for your comment! Check your DMs.");
                    }
                }
            }
        }
    }
}
