/**
 * @jest-environment node
 */
const connector = require('../src/sportstg-api')
const compId = '0-10486-0-539364-0'
const modernCompId = '1-7917-0-579261-0'
const wrapCompId = '1-6038-0-563114-0'

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
            expect(ladder.length).toEqual(19)
        })
})

test('Get ladder returns correct results', () => {
    expect.assertions(1)
    const expected = {a: 0, b: 0, d: 0, f: 8, fa: 0, gd: 8, l: 0, p: 1, pos: 1, pts: 3, team: 'Occasionally United', w: 1, teamLink: 'https://websites.sportstg.com/team_info.cgi?id=26500263&client=0-10486-0-539364-0&compID=539364'}
    return connector.getLadder(compId, 1)
        .then((ladder) => {
            const firstTeam = ladder[0]
            expect(firstTeam).toMatchObject(expected)
        })
})

test('Get ladder invalid compId throws error', () => {
    expect.assertions(1)
    const invalidCompId = '1-7919-0-0-0'
    return connector.getLadder(invalidCompId, 1)
        .catch(e => expect(e).toBeInstanceOf(Error))
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
            expect(fixtures.length).toEqual(8)
        })
})

test('Get fixtures returns correct values', () => {
    expect.assertions(1)
    return connector.getRoundFixtures(compId, 1)
        .then((fixtures) => {
            const firstMatch = fixtures[0]
            expect(firstMatch).toMatchObject({ 
                homeTeam: 'Going for Glory',
                homeScore: 5,
                awayTeam: 'Hot guys ',
                awayScore: 2 
            })
        })
})

test('Get fixtures returns correct values when providing pool', () => {
    expect.assertions(1)
    return connector.getRoundFixtures(compId, 1, 1)
        .then((fixtures) => {
            const firstMatch = fixtures[0]
            expect(firstMatch).toMatchObject({
                homeTeam: 'Going for Glory',
                homeScore: 5,
                awayTeam: 'Hot guys ',
                awayScore: 2
            })
        })
})

test('Get fixtures returns finals when providing finals pool', () => {
    expect.assertions(2)
    return connector.getRoundFixtures('0-10486-0-468974-0', 2, 1001)
        .then((fixtures) => {
            expect(fixtures.length).toEqual(1)
            expect(fixtures[0]).toMatchObject({
                homeTeam: 'Don\'t Believe the Hype',
                homeScore: 5,
                awayTeam: 'ABallaAndChill',
                awayScore: 3
            })
        })
})

test('Get fixtures throws error when providing invalid pool', () => {
    expect.assertions(1)
    return connector.getRoundFixtures(compId, 1, 2)
        .catch(e => expect(e).toBeInstanceOf(Error))
})

test('Get modern fixtures returns array', () => {
    expect.assertions(1)
    return connector.getRoundFixtures(modernCompId, 1)
        .then((fixtures) => {
            expect(fixtures).toBeInstanceOf(Array)
        })
})

test('Get modern fixtures returns correct size', () => {
    expect.assertions(1)
    return connector.getRoundFixtures(modernCompId, 1)
        .then((fixtures) => {
            expect(fixtures.length).toEqual(7)
        })
})

test('Get wrap fixtures returns array', () => {
    expect.assertions(1)
    return connector.getRoundFixtures(wrapCompId, 1)
        .then((fixtures) => {
            expect(fixtures).toBeInstanceOf(Array)
        })
})

test('Get wrap fixtures returns correct size', () => {
    expect.assertions(1)
    return connector.getRoundFixtures(wrapCompId, 1)
        .then((fixtures) => {
            expect(fixtures.length).toEqual(3)
        })
})
