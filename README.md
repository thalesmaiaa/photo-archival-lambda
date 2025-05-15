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

### Workflow Trigger & Permissions

```yaml
on:
  push:
    branches:
      - main

permissions:
  contents: read    # allows checking out code
  id-token: write   # enables OIDC for AWS auth
```
- **Trigger**: Runs on all pushes to the `main` branch.
- **contents: read**: Fetches repository files.
- **id-token: write**: Grants an OIDC token to assume an AWS role securely.

---

## Jobs Overview

- **build**: Checkout code → install dependencies → compile → package artifact
- **deploy**: Download artifact → configure AWS credentials → update Lambda

---

## Build Job Details

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Cache NPM
        uses: actions/cache@v3
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      - uses: actions/setup-node@v4
        with:
          node-version: '22.15.0'
      - run: npm ci
      - run: npm run build
      - name: Package artifact
        working-directory: dist
        run: zip -r ../app.zip .
      - uses: actions/upload-artifact@v4
        with:
          name: lambda-package
          path: app.zip
```
1. **Checkout**: Retrieves your repository.
2. **Cache NPM**: Speeds up installs by caching based on `package-lock.json`.
3. **Setup Node.js**: Installs the specified Node version.
4. **Install & Build**: `npm ci` for a clean install, then `npm run build` to output into `dist/`.
5. **Package**: Zips `dist/` into `app.zip`.
6. **Upload Artifact**: Exposes `app.zip` to the deploy job.

---

## Deploy Job Details

```yaml
jobs:
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: lambda-package
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ASSUME_ROLE_ARN }}
          aws-region:    ${{ secrets.AWS_REGION }}
      - name: Deploy to Lambda
        run: |
          aws --no-cli-pager lambda update-function-code \
            --function-name ${{ secrets.AWS_LAMBDA_FUNCTION_NAME }} \
            --zip-file fileb://app.zip \
            --query 'LastModified' --output text
```
1. **Download Artifact**: Retrieves the `app.zip` package.
2. **Configure AWS**: Assumes the IAM role via OIDC.
3. **Deploy**: Updates your Lambda function and outputs the `LastModified` timestamp only.

---

## Secrets & Configuration

| Secret Name                     | Description                              |
|---------------------------------|------------------------------------------|
| `AWS_ASSUME_ROLE_ARN`           | IAM Role ARN for OIDC authentication     |
| `AWS_REGION`                    | AWS region (e.g., `us-east-1`)           |
| `AWS_LAMBDA_FUNCTION_NAME`      | Target Lambda function name or ARN       |

> **Note**: Learn how to manage encrypted secrets in GitHub: https://docs.github.com/actions/security-guides/encrypted-secrets


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
