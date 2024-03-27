# dql-lambda

Um lambda com uma dlq só enviará mensagens para a dlq caso o produtor da mensagem seja assíncrono (SNS, S3, SES, CloudWatch Logs, EventBridge, CodeCommit, Config)

Para testar envie a mensagem `fail` no SNS