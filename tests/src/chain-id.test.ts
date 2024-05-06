import { assert, describe, test } from 'matchstick-as/assembly/index';
import { CHAIN_ID } from '../../src/chain-id';
import { log } from 'matchstick-as/assembly/log';

describe('chain-id', () => {
  test('Should have ID 1 (Ethereum) as default test CHAIN_ID', () => {
    log.info('CHAIN_ID: ' + CHAIN_ID.toString(), []);
    assert.i32Equals(CHAIN_ID, 1);
  });
});
