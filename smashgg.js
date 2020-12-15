const { GraphQLClient, gql } = require('graphql-request')

const smashToken = process.env.SMASHGG_API_KEY;

const query = gql`
query PhaseGroupQuery($id: ID!, $page: Int!, $perPage: Int!){
  phaseGroup(id:$id){
   seeds(query: {
      page: $page
      perPage: $perPage
    }){
      pageInfo {
        total
        totalPages
      }
      nodes {
        entrant {
          name
        }
      }
    }
  }
}
`

async function runQuery(query, variables) {
  const endpoint = 'https://api.smash.gg/gql/alpha';
  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: 'Bearer ' + smashToken,
    },
  });
  try {
    const data = await graphQLClient.request(query, variables)
    return data;
  } catch (error) {
    console.error(error);
  }
  return false;
};

async function getPlayersFromPhaseGroup(id) {
  let variables = { id: id, page: 1, perPage: 100 };
  let players = [];
  const resp = await runQuery(query, variables);
  players = players.concat(extractPlayerNames(resp));
  for (i = 1; i < resp.phaseGroup.seeds.pageInfo.totalPages; i++) {
    variables.page = i;
    resp = await runQuery(query, variables);
    players = players.concat(extractPlayerNames(resp));
  }
  let results = players.sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });
  return results;
}

function extractPlayerNames(data) {
  var players = []
  data.phaseGroup.seeds.nodes.forEach(element => {
    players = players.concat(element.entrant.name);
  });
  return players;
}


module.exports.getPlayersFromPhaseGroup = getPlayersFromPhaseGroup;