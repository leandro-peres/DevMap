const axios = require('axios');
const Dev = require('../models/Dev');

const parseStringAsArray = require('../utils/parseStringAsArray');

const { findConnections, sendMessage } = require('../websocket');

module.exports = {
  async index(request, response) {
    return response.json(await Dev.find());
  },

  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body;

    let dev = await Dev.findOne({ github_username });
    if (dev) {
      return response.json(dev);
    }

    const githubResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    const { name = login, avatar_url, bio } = githubResponse.data; // if name == "", = login

    const techArray = parseStringAsArray(techs);

    const location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };

    dev = await Dev.create({
      github_username,
      name,
      avatar_url,
      bio,
      techs: techArray,
      location,
    });

    // connections filter 
    const sendSocketMessageTo = findConnections(
      { latitude, longitude },
      techArray,
    );

    sendMessage(sendSocketMessageTo, 'new-dev', dev);

    return response.json(dev);
  }
};