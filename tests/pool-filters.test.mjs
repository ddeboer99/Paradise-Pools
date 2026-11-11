import { test } from 'node:test';
import assert from 'node:assert/strict';
import { poolModels, poolVariants, poolModelFacets, matchesPool, comparePoolModels } from '../src/data/pools.js';
const model = id => poolModels.find(pool => pool.id === id);

test('feet-only deep ends do not inherit shallow-end inches', () => {
  assert.deepEqual(poolVariants(model('corinthian')).map(v => v.maxDepth), [5 + 5 / 12, 6, 7]);
  assert.equal(matchesPool(model('corinthian'), { size: 'medium', depth: '6' }), true);
  assert.equal(matchesPool(model('barcelona'), { depth: 'over-7' }), false);
});
test('combined size/depth filters must match one variant', () => {
  assert.equal(matchesPool(model('athens'), { size: 'small', depth: '6' }), true);
  assert.equal(matchesPool(model('athens'), { size: 'large', depth: '6' }), false);
  assert.equal(matchesPool(model('cayman'), { size: 'large', depth: '6' }), false);
  assert.equal(matchesPool(model('monaco'), { size: 'large', depth: 'over-7' }), true);
});
test('flat depths and unspecified depths are handled explicitly', () => {
  assert.deepEqual(poolVariants(model('milan')).map(v => v.maxDepth), [4, 4, 4 + 10 / 12]);
  assert.equal(matchesPool(model('plunge-pools'), { depth: '5' }), false);
  assert.equal(matchesPool(model('plunge-pools'), { size: 'small' }), true);
});
test('feature punctuation and word boundaries do not lose or invent matches', () => {
  for (const id of ['astoria', 'classic', 'enchantment']) assert.equal(matchesPool(model(id), { feature: 'auto-cover' }), true);
  assert.equal(matchesPool(model('astoria'), { feature: 'spa' }), true);
  assert.ok(!poolModelFacets({ ...model('aruba'), features: 'A spacious swimming area.' }).features.includes('spa'));
});
test('size boundary, search, and reset use the complete catalog', () => {
  assert.equal(matchesPool(model('corinthian'), { size: 'small' }), true);
  assert.equal(matchesPool(model('key-west'), { size: 'small' }), false);
  assert.deepEqual(poolModels.filter(pool => matchesPool(pool, { search: ' MONACO ' })).map(pool => pool.id), ['monaco']);
  assert.equal(poolModels.filter(pool => matchesPool(pool, {})).length, 31);
});
test('unknown depths sort last in either direction, using maximum pool depth', () => {
  for (const sort of ['shallowest', 'deepest']) assert.ok(comparePoolModels(model('plunge-pools'), model('monaco'), sort) > 0);
  assert.ok(comparePoolModels(model('milan'), model('corinthian'), 'shallowest') < 0);
  assert.ok(comparePoolModels(model('monaco'), model('milan'), 'deepest') < 0);
});
test('every catalog entry retains usable length data and ordered depth ranges', () => {
  for (const pool of poolModels) {
    const variants = poolVariants(pool);
    assert.ok(variants.length > 0, pool.id);
    for (const variant of variants) {
      assert.ok(variant.length > 0, pool.id);
      assert.ok(variant.maxDepth === null || variant.maxDepth >= variant.minDepth, pool.id);
    }
  }
});
