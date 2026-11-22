const bananaApi = 'https://marcconrad.com/uob/banana/api.php';

export async function fetchPuzzle({ signal, request = fetch } = {}) {
  const response = await request(bananaApi, { signal });
  if (!response.ok) {
    throw new Error(`Banana API returned HTTP ${response.status}`);
  }

  const puzzle = await response.json();
  if (typeof puzzle?.question !== 'string' || !puzzle.question.trim() ||
      !Number.isInteger(puzzle.solution) || puzzle.solution < 0 || puzzle.solution > 9) {
    throw new Error('Banana API returned an invalid puzzle');
  }

  return puzzle;
}
