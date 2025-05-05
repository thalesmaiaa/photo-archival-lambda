# Photo Archival Lambda

This project is an AWS Lambda function designed to process images uploaded to a specific S3 bucket. When a new file is added or updated in the bucket, the Lambda function is triggered to analyze the image using Amazon Rekognition. The function detects labels and faces in the image and sends the results to another microservice for further interpretation.

## Features

- **S3 Trigger**: Automatically triggered when a file is uploaded or updated in the specified S3 bucket.
- **Image Analysis**: Uses Amazon Rekognition to detect labels and faces in the image.
- **Microservice Integration**: Sends analysis results to another microservice for data interpretation.
- **Scalable**: Built to handle events efficiently using AWS Lambda's serverless architecture.

## Prerequisites

Before deploying this project, ensure you have the following:

1. An AWS account.
2. An S3 bucket configured to trigger the Lambda function on file updates.
3. Necessary IAM roles and permissions for the Lambda function to access S3, Rekognition, and the microservice endpoint.

## Deployment

1. Clone this repository:

   ```bash
   git clone https://github.com/thalesmaiaa/photoarchival-lambda.git
   cd photoarchival-lambda
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Package and deploy the Lambda function using AWS CLI or a deployment tool like AWS SAM or Serverless Framework.

4. Configure the S3 bucket to trigger the Lambda function on file uploads or updates.

5. Ensure the microservice endpoint is accessible and properly configured to receive data from the Lambda function.

## Usage

1. Upload an image to the configured S3 bucket.
2. The Lambda function will automatically process the image using Rekognition.
3. Results, including detected labels and faces, will be sent to the microservice for interpretation.

## License

This project is licensed under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Acknowledgments

- [AWS Lambda](https://aws.amazon.com/lambda/)
- [Amazon Rekognition](https://aws.amazon.com/rekognition/)
- [Amazon S3](https://aws.amazon.com/s3/)
- [Microservices Architecture](https://microservices.io/)
