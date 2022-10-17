const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs'); // setting up handlebars for dynamic templates
app.set('views', viewsPath); // customizing the views name
hbs.registerPartials(partialsPath);

//  Setup static directory to serve
app.use(express.static(publicDirectoryPath)); // A way to customize a server

app.get('', (req, res) => {
  // render allows use to render a handlebar template
  res.render('index', {
    title: 'Weather',
    name: 'Joel Plotnik',
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'Joel Plotnik',
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    helpText: 'This is a help message',
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an address!',
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

// match anything that hasn't been matches so far
app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Joel Plotnik',
    errorMessage: 'Page not found.',
  });
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
}); // starts the server on default port 3000
