const axios = require('axios')
const cheerio = require('cheerio')
const log = require('./logging.js')('sportstg')

const baseUrl =  'http://websites.sportstg.com'


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
    const response = await axios.get(url)
    if (response.status < 200 || response.status > 299) {
        throw new Error(response)
    }
    return response
}

async function makeGetRequestAndParseBody(url) {
    log.debug(`Fetching url ${url}`)
    const response = await makeGetRequest(url)
    return cheerio.load(response.data)
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
        const $ = await makeGetRequestAndParseBody(url)
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

}


module.exports = SportsTgConnector
