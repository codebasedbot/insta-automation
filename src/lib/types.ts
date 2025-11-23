export interface InstagramWebhookEvent {
  object: 'instagram';
  entry: Array<{
    id: string;
    time: number;
    messaging?: Array<{
      sender: { id: string };
      recipient: { id: string };
      timestamp: number;
      message?: {
        mid: string;
        text: string;
        is_echo?: boolean;
      };
    }>;
    changes?: Array<{
      field: 'comments' | 'mentions';
      value: {
        id: string;
        text: string;
        from: {
          id: string;
          username: string;
        };
        post_id: string;
        created_time: number;
        parent_id?: string;
      };
    }>;
  }>;
}
