import { SNS } from 'aws-sdk';


type Topic = 'user-bankroll-drip-collect'
|'bankroll-credit'
|'user-level-up'
|'user-iap'
|'user-follow'
|'user-unfollow'
|'connection-issue'
|'game-issue'
|'bankroll-issue'
|'user-bankroll-transaction-processed'
|'user-iap-calc'
|'user-bankroll-calc'
|'user-create'
|'user-pick-made'
|'correlated-pick-new'
|'push-notif-sent'
|'line-scored'
|'user-subscription-ended';

export interface PubSub {
  publish(topic: Topic, data: any): Promise<string>;
}


export class PubSubSNS implements PubSub {
  public constructor(private sns: SNS, private arnPrefix: string) { }

  public async publish(topic: Topic, data: any) {
    console.log(`pubsub to: ${this.arnPrefix}${topic}`);

    const res = await this.sns.publish({
      TopicArn: `${this.arnPrefix}${topic}`,
      Message: JSON.stringify(data),
    }).promise();

    return res.MessageId;
  }

  public getTopicFromArn(arn: string): Topic {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return arn.substring(this.arnPrefix.length);
  }
}
