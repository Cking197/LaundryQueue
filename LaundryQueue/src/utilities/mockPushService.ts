export type PushNotification = {
  toUserId: string | null;
  title: string;
  body?: string;
};

export class MockPushService {
  static send(notification: PushNotification) {
    console.log('MockPushService.send', notification);
    // In a real app we'd integrate with FCM / Push API. Here we just log.
  }
}

export default MockPushService;
