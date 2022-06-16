import type {NextApiRequest, NextApiResponse} from 'next';
import {getAvalancheClient} from '@figment-avalanche/lib';
import {BinTools} from 'avalanche';

type ResponseT = {
  secret: string;
  address: string;
};

export default function account(
  req: NextApiRequest,
  res: NextApiResponse<ResponseT | string>,
) {
  try {
    const bintools = BinTools.getInstance();

    const {network} = req.body;
    const client = getAvalancheClient(network);
    const chain = client.XChain();
    const keyChain = chain.keyChain();
    const keypair = keyChain.makeKey(); // There is a useful method to use here
    const secret = keypair.getPrivateKeyString();
    const address = keypair.getAddressString();

    console.log('Private key:');
    console.log(secret);
    let mypk = bintools.cb58Decode(secret.split('-')[1]);
    console.log(mypk.toString('hex'));
    console.log('Public key:');
    console.log(address);

    res.status(200).json({
      secret,
      address,
    });
  } catch (error) {
    console.log(error);

    let errorMessage = error instanceof Error ? error.message : 'Unknown Error';
    res.status(500).json(errorMessage);
  }
}
