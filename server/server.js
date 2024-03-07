const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');
const openid = require('openid');
const SteamStrategy = require('passport-steam').Strategy;
const passport = require('passport');
const session = require('express-session');
const PORT = process.env.PORT || 5001;
const axios = require('axios');
const steamApiKey = '002F3358E110BE95DD603A5A775AF0CA';
const csgoID = '730';
let loggedInUsers = 0;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000', // Frontend server address
  credentials: true, // Allow session cookie to be sent with requests
}));

// Session Middleware
app.use(session({
  secret: 'your_secret_key', // replace with a real secret key
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, // Helps prevent cross-site scripting (XSS) attacks
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 // Cookie expiration duration (e.g., one day in milliseconds)
  }
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport Config
// handle logins with Passport + OpenID
passport.use(new SteamStrategy({
    returnURL: 'http://localhost:5001/auth/steam/return',
    realm: 'http://localhost:5001/',
    apiKey: steamApiKey
  },
  function(identifier, profile, done) {
    process.nextTick(function () {
      loggedInUsers++;
      profile.identifier = identifier;
      return done(null, profile);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Handle production
if (process.env.NODE_ENV === 'production') {
  // Static folder
  app.use(express.static('../src'));

  // Handle SPA
  app.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
  });
}

app.get('/auth/steam',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });


  app.get('/auth/steam/return',
    passport.authenticate('steam', { failureRedirect: '/' }),
    async function(req, res) {
      if (req.isAuthenticated() && req.user._json) {
        const { steamid, personaname, profileurl } = req.user._json;
        try {
          let user = await prisma.user.findUnique({
            where: {
              steamId: steamid
            }
          });
          if (!user) {
            console.log("User does not exist: " + user)
            user = await prisma.user.create({
              data: {
                steamId: steamid,
                username: personaname,
                profileURL: profileurl,
                tradeURL: ""
              }
            });
          } else {
              console.log("User does exist: " + user)
          }
          loggedInUsers++;
          res.redirect('http://localhost:3000');
        } catch (error) {
          console.error('Error saving user to database:', error);
          res.redirect('http://localhost:3000');
        }
      }
    }
  );


app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
});

app.get('/api/getTradeURL', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const steamid = req.user._json.steamid;
      // Fetch user from the database
      const user = await prisma.user.findUnique({
        where: {
          steamId: steamid
        }
      });

      if (user && user.tradeURL && user.tradeURL.length > 15
        && user.tradeURL.includes("token=")) {
          res.json({ tradeURL: user.tradeURL });
      } else {
        res.json({ tradeURL: '' });
      }
    } catch (error) {
      console.error('Error fetching trade URL from database:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.post('/api/setTradeURL', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  try {
    const { steamid } = req.user._json;
    const tradeURL = req.body.tradeValue;

    await prisma.user.update({
      where: { steamId: steamid },
      data: { tradeURL: tradeURL },
    });
    res.status(200).json({ message: 'Trade URL updated successfully' });
  } catch (error) {
    console.error('Error updating trade URL:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/logout', function(req, res){
  if (req.isAuthenticated()) {
    req.logout(function(err) {
      if (err) {
        console.error('Logout error:', err);
        return next(err);
      }
      loggedInUsers--;
      console.log('Logout successful');
      res.redirect('/');
    });
  } else {
    console.log("No user is currently logged in.");
    res.redirect('/');
  }
});

app.get('/api/get-inventory', async (req, res) => {
  if (req.isAuthenticated()) {
    const steamid = req.user._json.steamid;
    const data = {
        "assets": [{
          name: "Chroma 2 Key",
          id: 1,
          price: 2.79,
          img: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S1MDeXkh6LBBOiezrLVYygaCYdDlB79_mwdKIlq-tY-LUlzgB6sYm27-W8dvx0Vey_0ZrY3ezetEQGWlygA/256fx256f"
        }, {
          name: "Chroma 2 Key",
          id: 2,
          price: 2.79,
          img: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S1MDeXkh6LBBOiezrLVYygaCYdDlB79_mwdKIlq-tY-LUlzgB6sYm27-W8dvx0Vey_0ZrY3ezetEQGWlygA/256fx256f"
        }, {
          name: "Chroma 2 Key",
          id: 3,
          price: 2.79,
          img: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S1MDeXkh6LBBOiezrLVYygaCYdDlB79_mwdKIlq-tY-LUlzgB6sYm27-W8dvx0Vey_0ZrY3ezetEQGWlygA/256fx256f"
        }, {
          name: "Chroma 2 Key",
          id: 4,
          price: 2.79,
          img: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S1MDeXkh6LBBOiezrLVYygaCYdDlB79_mwdKIlq-tY-LUlzgB6sYm27-W8dvx0Vey_0ZrY3ezetEQGWlygA/256fx256f"
        }, {
          name: "Chroma 2 Key",
          id: 5,
          price: 2.79,
          img: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S1MDeXkh6LBBOiezrLVYygaCYdDlB79_mwdKIlq-tY-LUlzgB6sYm27-W8dvx0Vey_0ZrY3ezetEQGWlygA/256fx256f"
        }, {
          name: "Chroma 2 Key",
          id: 6,
          price: 2.79,
          img: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S1MDeXkh6LBBOiezrLVYygaCYdDlB79_mwdKIlq-tY-LUlzgB6sYm27-W8dvx0Vey_0ZrY3ezetEQGWlygA/256fx256f"
        }, {
          name: "Chroma 2 Key",
          id: 7,
          price: 2.05,
          img: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S1MDeXkh6LBBOiezrLVYygaCYdDlB79_mwdKIlq-tY-LUlzgB6sYm27-W8dvx0Vey_0ZrY3ezetEQGWlygA/256fx256f"
        }, {
          name: "Chroma 2 Key",
          id: 8,
          price: 2.59,
          img: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxuxpJSXPbQv2S1MDeXkh6LBBOiezrLVYygaCYdDlB79_mwdKIlq-tY-LUlzgB6sYm27-W8dvx0Vey_0ZrY3ezetEQGWlygA/256fx256f"
        }],
        "descriptions": [],
        "total_inventory_count": 0,
        "success": 1,
        "rwgrsn": -2,
        "steamID": "76561198038526790",
        "appID": 730,
        "contextID": 2
    }
    res.json(data);
  }
});

app.get('/api/loggedInUsers', (req, res) => {
  res.json({ count: loggedInUsers });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
