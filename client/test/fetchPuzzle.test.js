import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fetchPuzzle } from '../src/components/Game/fetchPuzzle.js';

const puzzle = { question: 'https://example.com/puzzle.png', solution: 0 };

test('loads a puzzle and accepts zero as a solution', async () => {
  const signal = new AbortController().signal;
  const result = await fetchPuzzle({
    signal,
    request: async (url, options) => {
      assert.equal(url, 'https://marcconrad.com/uob/banana/api.php');
      assert.equal(options.signal, signal);
      return Response.json(puzzle);
    }
  });
  assert.deepEqual(result, puzzle);
});

test('rejects an HTTP failure even when its body contains a puzzle', async () => {
  await assert.rejects(fetchPuzzle({
    request: async () => Response.json(puzzle, { status: 503 })
  }), /HTTP 503/);
});

test('rejects a response without a playable puzzle', async () => {
  for (const invalid of [null, {}, { ...puzzle, question: '' }, { ...puzzle, solution: 10 }]) {
    await assert.rejects(fetchPuzzle({
      request: async () => Response.json(invalid)
    }), /invalid puzzle/);
  }
});

test('lets the caller retry after a network failure', async () => {
  const request = async () => Response.json(puzzle);
  await assert.rejects(fetchPuzzle({
    request: async () => { throw new Error('Network unavailable'); }
  }), /Network unavailable/);
  assert.deepEqual(await fetchPuzzle({ request }), puzzle);
});
