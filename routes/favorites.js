const router = require("express").Router();
const CoinGecko = require('coingecko-api');
const User = require('../models/User');
const CoinGeckoClient = new CoinGecko();
const isLoggedIn = require('../middlewares');

router.get('/', isLoggedIn, async (req, res, next) => {  
    const userFromCookie = req.session.currentUser;   
    try {
        const user = await User.findById(userFromCookie);
        const userFavorites = user.favorites;
        const data = await CoinGeckoClient.coins.all();
        res.json(data)
        //res.render('favorites',{userFavorites,data});        
    } catch (error) {
        next(error)
    }
  });

module.exports = router;