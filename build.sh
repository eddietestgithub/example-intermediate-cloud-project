#!/bin/bash
cdk()
{
    npx aws-cdk $@
}
npm install && npm run build && cp -r ./image/ build/image
cdk ls && cdk synth && cdk deploy --outputs-file ./user-app-cdk-output.json