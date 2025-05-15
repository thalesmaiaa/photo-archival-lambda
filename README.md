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

## Local Development

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

## Deploy Lambda Function into AWS

### Trigger Events
- **Push to `main` branch**: The workflow runs whenever changes are pushed to the `main` branch.

### Permissions
- Grants `read` access to repository contents.
- Grants `write` access to the `id-token` for authentication with AWS.

### Deploy

The workflow consists of a single job named `deploy` that runs on an `ubuntu-latest` environment. The job includes the following steps:

1. **Checkout Code**: Uses the `actions/checkout` action to clone the repository code into the runner.
2. **Set Up Node.js**: Configures Node.js version `22.15.0` and enables caching for `npm` dependencies.
3. **Install Dependencies**: Installs project dependencies using `npm ci`.
4. **Build the Project**: Runs the build process using `npm run build`.
5. **Package Files**: Copies necessary files (`package.json`, `node_modules`) to the `dist` directory and creates a ZIP archive (`app.zip`) of the project.
6. **Configure AWS Credentials**: Uses the `aws-actions/configure-aws-credentials` action to authenticate with AWS using a role specified in repository secrets.
7. **Deploy Lambda Function**: Updates the Lambda function code by uploading the `app.zip` file to AWS using the AWS CLI.

## Secrets Required
The workflow relies on the following secrets for deployment:
- `AWS_ASSUME_ROLE_ARN`: The ARN of the AWS role to assume for deployment.
- `AWS_REGION`: The AWS region where the Lambda function is deployed.
- `AWS_LAMBDA_FUNCTION_NAME`: The name of the Lambda function to update.

## Usage
1. Ensure the required secrets are configured in the repository settings.
2. Push changes to the `main` branch or create a pull request targeting `main` to trigger the workflow.
3. The workflow will automatically build, package, and deploy the Lambda function to AWS.

## Notes
- The workflow assumes the project is built using Node.js and follows a specific structure for deployment.
- Ensure the Lambda function and its associated resources (e.g., IAM roles, S3 buckets) are properly configured in AWS before running the workflow.

## License

This project is licensed under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Acknowledgments

- [AWS Lambda](https://aws.amazon.com/lambda/)
- [Amazon Rekognition](https://aws.amazon.com/rekognition/)
- [Amazon S3](https://aws.amazon.com/s3/)
- [Microservices Architecture](https://microservices.io/)
