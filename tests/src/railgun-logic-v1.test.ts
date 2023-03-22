import {
  describe,
  test,
  afterEach,
  clearStore,
  assert,
  logStore,
} from 'matchstick-as/assembly/index';
import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import {
  createCommitmentBatchEvent,
  createGeneratedCommitmentBatchEvent,
  createNullifiersEvent,
} from '../util/event-utils.test';
import {
  handleCommitmentBatch,
  handleGeneratedCommitmentBatch,
  handleNullifier,
} from '../../src/railgun-smart-wallet';
import { bigIntToBytes } from '../../src/utils';
import {
  assertCommonCommitmentFields,
  assertCommonFields,
  assertTokenFields,
} from '../util/assert.test';
import {
  MOCK_TOKEN_ERC20_HASH,
  MOCK_TOKEN_ERC20_TUPLE,
  MOCK_TOKEN_ERC721_HASH,
  MOCK_TOKEN_ERC721_TUPLE,
} from '../util/models.test';

describe('railgun-smart-wallet', () => {
  afterEach(() => {
    clearStore();
  });

  test('Should handle Nullifiers event', () => {
    const treeNumber = BigInt.fromString('2000');
    const nullifiers = [BigInt.fromString('3000'), BigInt.fromString('4000')];
    const event = createNullifiersEvent(treeNumber, nullifiers);

    handleNullifier(event);

    assert.entityCount('Nullifier', 2);

    const expectedIDs = [
      '0x000000000000000000000000000000000000000000000000000000000000d007000000000000000000000000000000000000000000000000000000000000b80b',
      '0x000000000000000000000000000000000000000000000000000000000000d007000000000000000000000000000000000000000000000000000000000000a00f',
    ];

    for (let i = 0; i < expectedIDs.length; i++) {
      const expectedID = expectedIDs[i];
      assertCommonFields('Nullifier', expectedID, event);

      assert.fieldEquals(
        'Nullifier',
        expectedID,
        'treeNumber',
        treeNumber.toString(),
      );
      assert.fieldEquals(
        'Nullifier',
        expectedID,
        'nullifier',
        bigIntToBytes(nullifiers[i]).toHexString(),
      );
    }
  });

  test('Should handle GenerateCommitmentBatch event', () => {
    const treeNumber = BigInt.fromString('2000');
    const startPosition = BigInt.fromString('3000');

    const commitments: Array<ethereum.Value>[] = [
      [
        // npk
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString('4100')),
        // token
        ethereum.Value.fromTuple(MOCK_TOKEN_ERC20_TUPLE),
        // value
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString('4300')),
      ],
      [
        // npk
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString('4600')),
        // token
        ethereum.Value.fromTuple(MOCK_TOKEN_ERC721_TUPLE),
        // value
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString('4800')),
      ],
    ];
    const encryptedRandom = [
      [BigInt.fromString('10000'), BigInt.fromString('11000')],
      [BigInt.fromString('12000'), BigInt.fromString('13000')],
    ];
    const event = createGeneratedCommitmentBatchEvent(
      treeNumber,
      startPosition,
      commitments,
      encryptedRandom,
    );

    handleGeneratedCommitmentBatch(event);

    assert.entityCount('Token', 2);
    assert.entityCount('CommitmentPreimage', 2);
    assert.entityCount('LegacyGeneratedCommitment', 2);

    assertTokenFields(MOCK_TOKEN_ERC20_HASH, MOCK_TOKEN_ERC20_TUPLE);
    assertTokenFields(MOCK_TOKEN_ERC721_HASH, MOCK_TOKEN_ERC721_TUPLE);

    const expectedIDs = [
      '0x000000000000000000000000000000000000000000000000000000000000d007000000000000000000000000000000000000000000000000000000000000b80b',
      '0x000000000000000000000000000000000000000000000000000000000000d007000000000000000000000000000000000000000000000000000000000000b90b',
    ];

    for (let i = 0; i < expectedIDs.length; i++) {
      const expectedID = expectedIDs[i];
      assertCommonCommitmentFields(
        'LegacyGeneratedCommitment',
        expectedID,
        event,
        treeNumber,
        startPosition,
        BigInt.fromI32(i),
      );

      assert.fieldEquals(
        'LegacyGeneratedCommitment',
        expectedID,
        'preimage',
        expectedID,
      );

      assert.fieldEquals(
        'CommitmentPreimage',
        expectedID,
        'npk',
        bigIntToBytes(commitments[i][0].toBigInt()).toHexString(),
      );
      assert.fieldEquals(
        'CommitmentPreimage',
        expectedID,
        'value',
        commitments[i][2].toBigInt().toString(),
      );
      assert.fieldEquals(
        'CommitmentPreimage',
        expectedID,
        'token',
        [MOCK_TOKEN_ERC20_HASH, MOCK_TOKEN_ERC721_HASH][i],
      );

      assert.fieldEquals(
        'LegacyGeneratedCommitment',
        expectedID,
        'encryptedRandom',
        `[${bigIntToBytes(
          encryptedRandom[i][0],
        ).toHexString()}, ${bigIntToBytes(
          encryptedRandom[i][1],
        ).toHexString()}]`,
      );
    }
  });

  test('Should handle CommitmentBatch event', () => {
    const treeNumber = BigInt.fromString('2000');
    const startPosition = BigInt.fromString('3000');

    const hash: BigInt[] = [
      BigInt.fromString('1111'),
      BigInt.fromString('2222'),
    ];

    const ciphertext: Array<ethereum.Value>[] = [
      [
        // ciphertext
        ethereum.Value.fromUnsignedBigIntArray([
          BigInt.fromString('4000'),
          BigInt.fromString('5000'),
        ]),
        // ephemeralKeys
        ethereum.Value.fromUnsignedBigIntArray([
          BigInt.fromString('6000'),
          BigInt.fromString('7000'),
        ]),
        // memo
        ethereum.Value.fromUnsignedBigIntArray([
          BigInt.fromString('8000'),
          BigInt.fromString('9000'),
        ]),
      ],
      [
        // ciphertext
        ethereum.Value.fromUnsignedBigIntArray([
          BigInt.fromString('14000'),
          BigInt.fromString('15000'),
        ]),
        // ephemeralKeys
        ethereum.Value.fromUnsignedBigIntArray([
          BigInt.fromString('16000'),
          BigInt.fromString('17000'),
        ]),
        // memo
        ethereum.Value.fromUnsignedBigIntArray([
          BigInt.fromString('18000'),
          BigInt.fromString('19000'),
        ]),
      ],
    ];
    const event = createCommitmentBatchEvent(
      treeNumber,
      startPosition,
      hash,
      ciphertext,
    );

    handleCommitmentBatch(event);

    assert.entityCount('Ciphertext', 2);
    assert.entityCount('LegacyEncryptedCommitment', 2);

    const expectedIDs = [
      '0x000000000000000000000000000000000000000000000000000000000000d007000000000000000000000000000000000000000000000000000000000000b80b',
      '0x000000000000000000000000000000000000000000000000000000000000d007000000000000000000000000000000000000000000000000000000000000b90b',
    ];

    for (let i = 0; i < expectedIDs.length; i++) {
      const expectedID = expectedIDs[i];
      assertCommonCommitmentFields(
        'LegacyEncryptedCommitment',
        expectedID,
        event,
        treeNumber,
        startPosition,
        BigInt.fromI32(i),
      );

      // TODO: check ciphertext fields

      assert.fieldEquals(
        'LegacyEncryptedCommitment',
        expectedID,
        'ciphertext',
        expectedID,
      );
    }
  });
});