#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsProjectStack } from '../lib/Stack/aws-project-stack';

const app = new cdk.App();

new AwsProjectStack(app, 'AwsProjectStack');


app.synth();