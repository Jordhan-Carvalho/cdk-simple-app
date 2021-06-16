import * as cdk from '@aws-cdk/core';
import * as route53 from '@aws-cdk/aws-route53';
import { IPublicHostedZone } from '@aws-cdk/aws-route53';
import * as acm from '@aws-cdk/aws-certificatemanager';
import { CertificateValidation, ICertificate } from '@aws-cdk/aws-certificatemanager';

interface SimpleAppStackDnsProps extends cdk.StackProps{
  dnsName: string
}

export class SimpleAppStackDns extends cdk.Stack {
  public readonly hostedZone: IPublicHostedZone;
  public readonly certificate: ICertificate;

  constructor(scope: cdk.Construct, id: string, props?: SimpleAppStackDnsProps) {
    super(scope, id, props);

    this.hostedZone = new route53.PublicHostedZone(this, 'SimpleAppStackHostedZone', {
      zoneName: props!.dnsName
    });

    this.certificate = new acm.Certificate(this, 'SimpleAppCertificateManager', {
      domainName: props!.dnsName,
      validation: CertificateValidation.fromDns(this.hostedZone),
    })

  }
}
