import axios from 'axios';

const GRAPH_API_URL = 'https://graph.facebook.com/v18.0';

export async function sendReply(recipientId: string, messageText: string) {
  const token = process.env.GRAPH_API_TOKEN;
  if (!token) {
    console.error('GRAPH_API_TOKEN is not defined');
    return;
  }

  try {
    await axios.post(
      `${GRAPH_API_URL}/me/messages`,
      {
        recipient: { id: recipientId },
        message: { text: messageText },
      },
      {
        params: { access_token: token },
        headers: { 'Content-Type': 'application/json' },
      }
    );
    console.log(`Reply sent to ${recipientId}`);
  } catch (error: any) {
    console.error('Error sending reply:', error.response?.data || error.message);
  }
}

export async function getUserProfile(userId: string) {
    const token = process.env.GRAPH_API_TOKEN;
    if (!token) return null;

    try {
        const response = await axios.get(`${GRAPH_API_URL}/${userId}`, {
            params: {
                fields: 'id,name,username',
                access_token: token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile', error);
        return null;
    }
}
