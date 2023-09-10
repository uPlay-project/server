// routes/auth.js
const express = require('express');
const axios = require('axios');
const querystring = require('querystring');

const router = express.Router();

// Spotify API credentials
const clientId = process.env.SPOTIFY_CLIENT_ID; //  Spotify Client ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET; // Spotify Client Secret
const redirectUri = 'http://localhost:3000/callback'; //  Redirect URI in  Spotify Developer Dashboard

// access token temporarily (in-memory)
let accessToken = '';

// Spotify API endpoints
const spotifyApiBaseUrl = 'https://accounts.spotify.com/api/token';

// Middleware to check for a valid access token
const checkAccessToken = (req, res, next) => {
  if (!accessToken) {
    res.status(401).json({ error: 'Access token is missing or invalid.' });
  } else {
    next();
  }
};

// Spotify login
router.get('/login', (req, res) => {
  const scope = 'user-read-private user-read-email'; // Add scopes as needed
  res.redirect(`https://accounts.spotify.com/authorize?${querystring.stringify({
    response_type: 'code',
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectUri,
  })}`);
});

// Handle Spotify callback
router.get('/callback', async (req, res) => {
  const code = req.query.code || null;

  // Request access token using the code
  try {
    const tokenResponse = await axios.post(spotifyApiBaseUrl, querystring.stringify({
      code: code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }), {
      auth: {
        username: clientId,
        password: clientSecret,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    accessToken = tokenResponse.data.access_token;

    // Redirect to  frontend or send a success message
    res.redirect('http://localhost:3000'); // Change to your frontend URL
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: 'Unable to fetch access token.' });
  }
});

module.exports = router;
