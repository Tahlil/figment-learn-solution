import type {NextApiRequest, NextApiResponse} from 'next';
import {getAvalancheClient} from '@figment-avalanche/lib';

type ResponseT = {
  secret: string;
  address: string;
};

export default function account(
  req: NextApiRequest,
  res: NextApiResponse<ResponseT | string>,
) {
  try {
    const {network} = req.body;
    const client = getAvalancheClient(network);
    const chain = client.XChain();
    const keyChain = chain.keyChain();
    const keypair = keyChain.makeKey(); // There is a useful method to use here
    const secret = keypair.getPrivateKeyString();
    const address = keypair.getAddressString().toString('hex');
    console.log(keypair.getHRP());

    console.log(address);

    res.status(200).json({
      secret,
      address,
    });
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : 'Unknown Error';
    res.status(500).json(errorMessage);
  }
}
