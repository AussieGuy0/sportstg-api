/**
 * @jest-environment node
 */
const connector = require('../src/sportstg-api')
const compId = '0-10486-0-507859-0'

test('Get ladder returns array', () => {
    expect.assertions(1)
    return connector.getLadder(compId)
        .then((ladder) => {
            expect(ladder).toBeInstanceOf(Array)
        })
})

test('Get ladder returns correct size', () => {
    expect.assertions(1)
    return connector.getLadder(compId)
        .then((ladder) => {
            expect(ladder.length).toEqual(5)
        })
})

test('Get ladder returns correct results', () => {
    expect.assertions(1)
    return connector.getLadder(compId, 1)
        .then((ladder) => {
            const firstTeam = ladder[0]
            expect(firstTeam).toMatchObject({ pos: 1,
                team: 'Real Real',
                p: 1,
                w: 1,
                b: 0,
                d: 0,
                l: 0,
                fa: 0,
                f: 14,
                a: 4,
                gd: 10,
                pts: 3 })
        })
})

test('Get fixtures returns array', () => {
    expect.assertions(1)
    return connector.getRoundFixtures(compId, 1)
        .then((fixtures) => {
            expect(fixtures).toBeInstanceOf(Array)
        })
})

test('Get fixtures returns correct size', () => {
    expect.assertions(1)
    return connector.getRoundFixtures(compId, 1)
        .then((fixtures) => {
            expect(fixtures.length).toEqual(4)
        })
})

test('Get fixtures returns correct values', () => {
    expect.assertions(1)
    return connector.getRoundFixtures(compId, 1)
        .then((fixtures) => {
            const firstMatch = fixtures[0]
            expect(firstMatch).toMatchObject({ 
                homeTeam: 'Billyz Boyz',
                homeScore: 8,
                awayTeam: 'Parma-giana FC',
                awayScore: 3 
            })
        })
})
