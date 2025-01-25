const axios = require('axios');

const challongeUsername = process.env.CHALLONGE_USERNAME;
const challongeToken = process.env.CHALLONGE_API_KEY;

async function getParticipants(id) {
  try {
    const endpoint = 'https://api.challonge.com/v1/tournaments/' + id + '/participants.json'
    const resp = await axios.get(endpoint, {
      auth: {
        username: challongeUsername,
        password: challongeToken
      },
    });
    let results = extractPlayerNames(resp.data).sort(function (a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    return results;
  } catch(error) {
    console.error(error.config.url);
    console.error(error.response.status);
  }
  return false;
}

function extractPlayerNames(data) {
  var players = []
  data.forEach(element => {
    players = players.concat(element.participant.name);
  });
  return players;
}

module.exports.getParticipants = getParticipants;