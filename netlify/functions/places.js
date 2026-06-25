const https = require('https');

exports.handler = async function(event) {
  const params = event.queryStringParameters || {};
  const action = params.action;
  const apiKey = params.key;

  if (!apiKey) return { statusCode: 400, body: JSON.stringify({ error: 'Missing key' }) };

  let url = '';
  if (action === 'nearby') {
    url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${params.lat},${params.lng}&radius=15000&keyword=${encodeURIComponent(params.keyword)}&language=pt&key=${apiKey}`;
  } else if (action === 'details') {
    url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${params.place_id}&fields=name,formatted_address,formatted_phone_number,website,rating,user_ratings_total&language=pt&key=${apiKey}`;
  } else {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid action' }) };
  }

  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: 200,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: data
        });
      });
    }).on('error', (e) => {
      resolve({ statusCode: 500, body: JSON.stringify({ error: e.message }) });
    });
  });
};
