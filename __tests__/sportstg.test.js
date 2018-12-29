/**
 * @jest-environment node
 */
const assert = require('assert') //For AssertionError object definition
const connector = require('../src/sportstg-api')
const compId = '0-10486-0-507859-0'

test('Get ladder validates compId', () => {
    expect.assertions(1)  
    return connector.getLadder()
        .then(() => {}) //Should not return ladder object
        .catch((error) =>{
            expect(error).toBeInstanceOf(assert.AssertionError)
        })
})

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
    const expected = {'a': 40, 'b': 0, 'd': 0, 'f': 140, 'fa': 0, 'gd': 100, 'l': 0, 'p': 10, 'pos': 1, 'pts': 30, 'team': 'Real Real', 'w': 10}
    return connector.getLadder(compId, 1)
        .then((ladder) => {
            const firstTeam = ladder[0]
            expect(firstTeam).toMatchObject(expected)
        })
})

test('Get fixtures validates compId', () => {
    expect.assertions(1)  
    return connector.getRoundFixtures()
        .then(() => {}) //Should not return fixtures object
        .catch((error) =>{
            expect(error).toBeInstanceOf(assert.AssertionError)
        })
})

test('Get fixtures validates roundNum', () => {
    expect.assertions(1)   
    return connector.getRoundFixtures(compId)
        .then(() => {}) //Should not return fixtures object
        .catch((error) =>{
            expect(error).toBeInstanceOf(assert.AssertionError)
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
