import { BigInt, Address } from '@graphprotocol/graph-ts';
import { PoseidonT4 } from './class/PoseidonT4';
import { getPoseidonT4ContractAddress } from './contracts';

export const poseidonT4Hash = (
  input1: BigInt,
  input2: BigInt,
  input3: BigInt
): BigInt => {
  const addressHex = getPoseidonT4ContractAddress();
  const contractAddress = Address.fromString(addressHex);
  const poseidonContract = PoseidonT4.bind(contractAddress);
  let callResult = poseidonContract.try_poseidon1([input1, input2, input3]);
  if (callResult.reverted) {
    throw new Error('Poseidon hash call reverted');
  }
  return callResult.value;
};

export const getNoteHash = (
  npk: BigInt,
  tokenHash: BigInt,
  value: BigInt
): BigInt => {
  return poseidonT4Hash(npk, tokenHash, value);
};
