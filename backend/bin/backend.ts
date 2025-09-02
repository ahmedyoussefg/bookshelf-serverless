#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { BookStack } from '../lib/book-stack';
import { DatabaseStack } from '../lib/database-stack';
import { ApiStack } from '../lib/api-stack';
import { AuthStack } from '../lib/auth-stack';

const app = new cdk.App();
const dbStack = new DatabaseStack(app, 'DatabaseStack', {});
const apiStack = new ApiStack(app, 'ApiStack');
new AuthStack(app, 'AuthStack', {
  table: dbStack.table,
  api: apiStack.api,
  authModel: apiStack.authModel,
  authRequestValidator: apiStack.authRequestValidator,
});

new BookStack(app, 'BookStack', {
  table: dbStack.table,
  api: apiStack.api,
  createBookModel: apiStack.createBookModel,
  updateBookModel: apiStack.updateBookModel,
  createBookRequestValidator: apiStack.createBookRequestValidator,
  updateBookRequestValidator: apiStack.updateBookRequestValidator,
  deleteBookRequestValidator: apiStack.deleteBookRequestValidator,
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});