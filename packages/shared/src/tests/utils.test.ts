import { map, wait, getWordArray } from '../index'

describe('utils', () => {
  it('linearly map of number that is within a range to another range', () => {
    expect(map(5, 0, 10, 0, 100)).toBe(50);
    expect(map(1, 0, 10, 0, 100)).toBe(10);
    expect(map(0, 0, 10, 0, 100)).toBe(0);
    expect(map(10, 0, 10, 0, 100)).toBe(100);
    expect(map(100, 0, 10, 0, 100)).toBe(100);
    expect(map(-10, 0, 10, 0, 100)).toBe(0);
  })

  it('wait for a given time', async () => {
    const start = Date.now()
    await wait(100)
    const end = Date.now()
    expect(end - start).toBeGreaterThanOrEqual(100)
  })

  it('gets word array from a word', () => {
    expect(getWordArray('hello world')).toEqual([
      {
        ltr: 'h',
        isGuessed: false
      },
      {
        ltr: 'e',
        isGuessed: false
      },
      {
        ltr: 'l',
        isGuessed: false
      },
      {
        ltr: 'l',
        isGuessed: false
      },
      {
        ltr: 'o',
        isGuessed: false
      },
      {
        ltr: " ",
        isGuessed: true
      },
      {
        ltr: 'w',
        isGuessed: false
      },
      {
        ltr: 'o',
        isGuessed: false
      },
      {
        ltr: 'r',
        isGuessed: false
      },
      {
        ltr: 'l',
        isGuessed: false
      },
      {
        ltr: 'd',
        isGuessed: false
      }
    ])
  })
});

