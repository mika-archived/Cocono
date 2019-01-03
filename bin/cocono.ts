#!/usr/bin/env node
import cdk = require('@aws-cdk/cdk');
import { CoconoStack } from '../lib/cocono-stack';

const app = new cdk.App();
new CoconoStack(app, 'CoconoStack');
app.run();
