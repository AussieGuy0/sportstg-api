const axios = require('axios')
const cheerio = require('cheerio')
const log = require('./logging.js')('sportstg')

const baseUrl = 'https://websites.sportstg.com'

function getLadderUrl(compId, roundNum) {
    const url = `${baseUrl}/comp_info.cgi?c=${compId}&pool=1`
    if (roundNum != null) {
        return url  + `&round=${roundNum}`
    } else {
        return url
    }
}

function getRoundUrl(compId, roundNum) {
    return `${baseUrl}/comp_info.cgi?a=ROUND&c=${compId}&pool=1&round=${roundNum}`
}

async function makeGetRequest(url) {
    log.debug(`Fetching url ${url}`)
    const response = await axios.get(url)
    if (response.status < 200 || response.status > 299) {
        throw new Error(response)
    }
    return response
}

async function makeGetRequestAndParseBody(url) {
    const response = await makeGetRequest(url)
    return parseHtml(response.data)
}

function parseHtml(html) {
    return cheerio.load(html)
}

function parseClassicFixtures($) {
    const fixtures = []
    $('.classic-results .fixturerow').each((index, element) => {
        const currentElement = $(element)
        function getText(selector) {
            return currentElement.children(selector).text()
        }
        const fixture = {
            date: getText('.matchdate'),
            homeTeam: getText('.hometeam'),
            homeScore: parseInt(getText('.homescore')),
            awayTeam: getText('.awayteam'),
            awayScore: parseInt(getText('.awayscore'))
        }
        fixtures.push(fixture)
    })
    return fixtures
}

function parseWrapFixtures($) {
    const fixtures = []
    $('.all-fixture-wrap .fixturerow').each((index, element) => {
        const currentElement = $(element)
        function getText(selector) {
            return currentElement.find(selector).text()
        }
        const fixture = {
            date: getText('.match-time'),
            homeTeam: getText('.home-team .team-name'),
            homeScore: parseInt(getText('.home-team .team-score')),
            awayTeam: getText('.away-team .team-name'),
            awayScore: parseInt(getText('.away-team .team-score'))
        }
        fixtures.push(fixture)
    })
    return fixtures
    
}

function parseModernFixtures(rawHtml) {
    const matchesJsonStart = 'var matches = '
    const indexOfMatches = rawHtml.indexOf(matchesJsonStart)
    if (indexOfMatches === -1) {
        throw new Error('Tried to parse fixtures as modern but could not find "matches" json')
    }
    const endScriptTagIndex = rawHtml.indexOf('</script>', indexOfMatches)
    if (endScriptTagIndex === -1) {
        throw new Error('Tried to parse fixtures as modern but could not find end of "matches" json')
    }

    // - 1 on end index to remove semicolon
    const rawJson = rawHtml.substring(indexOfMatches + matchesJsonStart.length, endScriptTagIndex - 1)
    return JSON.parse(rawJson)
}

const SportsTgConnector  = {
    getLadder: async (compId, roundNum) => {
        const url = getLadderUrl(compId, roundNum)
        const $ = await makeGetRequestAndParseBody(url)
        const headingRow = []
        $('.tableContainer tbody tr th').each((index, headingElement) => {
            headingRow.push($(headingElement).text().toLowerCase()) 
        })
        log.debug(`Ladder heading row is ${headingRow}`)

        if (headingRow.length === 0) {
            throw new Error(`No ladder found on the page! Please check '${url}' in a browser and change the compId (${compId}) to a valid competition.\nIf there is a ladder on the page, please raise a GitHub issue.`)
        }
        const teams = []
        $('.tableContainer tbody tr').each((index, row) => {
            if (index === 0) {
                return //skip heading row
            }
            const team = {}
            $(row).find('td').each((index, cell) => {
                const heading = headingRow[index]
                const cellText = $(cell).text()
                if (heading === 'team') {
                    team[heading] = cellText
                    const teamLink =  $(cell).find('a').attr('href');
                    if (teamLink) {
                        team.teamLink = `${baseUrl}/${teamLink}`
                    }
                } else {
                    team[heading] = parseInt(cellText)
                }
            })
            teams.push(team)
        })
        return teams
    },
    getRoundFixtures: async (compId, roundNum) => {
        const url = getRoundUrl(compId, roundNum)
        const response = await makeGetRequest(url)
        const html = response.data
        const $ = parseHtml(html)
        let fixtures
        if ($('.classic-results').length > 0) {
            log.debug('Detected classic results table')
            fixtures = parseClassicFixtures($)
        } else if ($('.all-fixture-wrap').length > 0) {
            log.debug('Detected wrap fixtures')
            fixtures = parseWrapFixtures($)
        } else {
            log.debug('Detected modern results table')
            fixtures = parseModernFixtures(html)
        }
        if (fixtures.length === 0) {
            log.debug(`No fixtures found for compId: ${compId}, roundNum: ${roundNum}. Full url: ${url}`)
        }
        return fixtures
    }
}


module.exports = SportsTgConnector