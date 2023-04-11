import { BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { bigIntToBytes, padTo32BytesEnd } from './utils';

export const idFrom2PaddedBigInts = (
  bigint0: BigInt,
  bigint1: BigInt,
): Bytes => {
  // Convert to hexString, pad to end.
  const bytes0 = padTo32BytesEnd(bigIntToBytes(bigint0));
  const bytes1 = padTo32BytesEnd(bigIntToBytes(bigint1));

  // 64 bytes total. 128 chars.
  return bytes0.concat(bytes1);
};

/**
 * NOTE: The event log index will be converted to Bytes little-endian.
 */
export const idFromEventLogIndex = (event: ethereum.Event): Bytes => {
  return event.transaction.hash.concatI32(event.logIndex.toI32());
};
