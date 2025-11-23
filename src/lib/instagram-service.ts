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
                // Handle Messages (DMs)
                if (entry.messaging) {
                    for (const messageEvent of entry.messaging) {
                        if (messageEvent.message && !messageEvent.message.is_echo) {
                            const senderId = messageEvent.sender.id;
                            const text = messageEvent.message.text;
                            console.log(`Received message from ${senderId}: ${text}`);

                            // Auto-reply logic for DMs
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

                            // Check if comment contains "hello" (case-insensitive)
                            if (text.toLowerCase().includes('hello')) {
                                console.log('Comment contains "hello". Triggering auto-reply.');

                                // 1. Reply to the comment publicly
                                try {
                                    await replyToComment(commentId, "Thanks for your comment! Check your DMs.");
                                } catch (e) {
                                    console.error("Failed to reply to comment:", e);
                                }

                                // 2. Send a DM to the commenter
                                try {
                                    await sendDM(senderId, "Thanks for your comment!");
                                } catch (e) {
                                    console.error("Failed to send DM to commenter:", e);
                                }
                            } else {
                                console.log('Comment does not contain "hello". Ignoring.');
                            }
                        }
                    }
                }
            }
        }
