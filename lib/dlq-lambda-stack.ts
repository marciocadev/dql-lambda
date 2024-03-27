import * as cdk from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { SqsDestination } from 'aws-cdk-lib/aws-lambda-destinations';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { LambdaSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { join } from 'path';

export class DlqLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sns = new Topic(this, "producer")

    const queueDlq = new Queue(this, "dlq-queue")
    const withDlq = new NodejsFunction(this, "with-dlq", {
      entry: join(__dirname, "lmb", "dlq.ts"),
      handler: "handler",
      runtime: Runtime.NODEJS_20_X,
      deadLetterQueue: queueDlq
    })

    const queueDestinations = new Queue(this, "destinations-queue")
    const withFailDestinations = new NodejsFunction(this, "with-fail-destinations", {
      entry: join(__dirname, "lmb", "destinations.ts"),
      handler: "handler",
      runtime: Runtime.NODEJS_20_X,
      onFailure: new SqsDestination(queueDestinations),
    });

    sns.addSubscription(new LambdaSubscription(withDlq))
    sns.addSubscription(new LambdaSubscription(withFailDestinations))
  }
}
