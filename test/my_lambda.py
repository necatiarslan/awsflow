import datetime
def handler(event, context):
    print("Received event: " + str(event))
    print("Received context: " + str(context))
    return {
        'statusCode': 200,
        'body': 'Hello from Lambda!',
        'event': event,
        'context': {
            'function_name': context.function_name,
            'aws_request_id': context.aws_request_id
        },
        'timestamp': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }