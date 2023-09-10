const express = require('express');
// const axios = require('axios');
const router = express.Router(); // Use express.Router() to create a router instance
// const checkAccessToken = require("../config/spotify.config");
// const spotifyApiBaseUrl = 'https://api.spotify.com/v1';

const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

  

router.get('/album', async (req, res, next) => {
  try {
    const response = await spotifyApi.getAlbum('5U4W9E5WsYb2jUQWePT8Xm')
    console.log("Album ", response.body);
    res.json(response.body);
  
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: 'Unable to fetch album' });
  }
});




// const router = require("express").Router();
// const Album = require("../models/Album.model");
// const fileUploader = require("../config/cloudinary.config");
// const { isAuthenticated } = require("../middlewares/jwt.middleware");


// //get route /api/ablum
// router.get("/album", async (req, res, next)=> {
//     try {
// const getAlbumDb = await Album.find()
// .populate("track")
// res.status(201).json({ getAlbumDb });
//     }catch (err) {
//         console.log(
//           "====error while getting all album====there we go==>",
//           err
//         );
//       }
// })


// // Set up post route /api/album for  album and image  upload
// router.post(
//   "/album",
//   fileUploader.single("image"),
//   async (req, res, next) => {
//     try {
//       if (!req.file) {
//         return res.status(400).send("No files uploaded.");
      
//       }
//       console.log("show req.file", req.file)

//       // Create a new album record in the database
//       const {
//         total_tracks,
//         title,
//         release_date,
//         genre,
//         popularity,
//         album_type,
       
//       } = req.body;
// console.log("show req erro", req.body)
//       const createAlbumDB = await Album.create({
//         total_tracks,
//         title,
//         release_date,
//         genre,
//         popularity,
//         artist:[],
//         album_type,
//         image: req.file.path,
//         track: []
    
//       });
//       res.status(201).json({ createAlbumDB });
//       console.log("show create album",createAlbumDB )
//       //   res.json({ fileupload: req.file.path });
//     } catch (err) {
//       console.log(
//         "====through album  error ====there we go==>",
//         err
//       );
//     }
//   }
// );

// module.exports = router;
