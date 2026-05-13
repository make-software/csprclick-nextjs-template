import { PublicKey, Deploy, DeployHeader, ExecutableDeployItem, TransferDeployItem } from 'casper-js-sdk';

export default function makeTransferDeploy(
  senderPublicKeyHex: string | null,
  recipientPublicKeyHex: string,
  amountMotes: string,
  chainName: string
) {
  const senderPublicKey = PublicKey.fromHex(senderPublicKeyHex?.toLowerCase() || '');
  const recipientPublicKey = PublicKey.fromHex(recipientPublicKeyHex);

  const header = DeployHeader.default();
  header.chainName = chainName;
  header.account = senderPublicKey;

  const transferItem = TransferDeployItem.newTransfer(amountMotes, recipientPublicKey, null, '1');
  const session = new ExecutableDeployItem();
  session.transfer = transferItem;

  const payment = ExecutableDeployItem.standardPayment('100000000');

  const deploy = Deploy.makeDeploy(header, payment, session);
  return JSON.stringify(Deploy.toJSON(deploy));
}
