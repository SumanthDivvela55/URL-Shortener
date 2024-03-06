const express = require('express')
const mongoose = require('mongoose')
const shortURL = require('./models/shortUrl')
const app = express()
const shortid = require('shortid');
const port = process.env.PORT || 5000

mongoose.connect('mongodb://127.0.0.1:27017/url-Shortener');
console.log("MongoDb Connected")

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))


app.get('/', async (req, res) => {
    const shortUrls = await shortURL.find()
    res.render('index', { shortUrls: shortUrls })
})

app.post('/shorturl', async (req, res) => {
    const shrturl = shortid.generate()
    await shortURL.create({
        full: req.body.fullUrL,
        short: shrturl,
        clicks:0
    })
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    console.log('Short URL clicked:', req.params.shortUrl);
    const shortUrl = await shortURL.findOne({ short: req.params.shortUrl })
    console.log('Found short URL:', shortUrl);
    if (shortUrl == null) {
        console.log('Short URL not found');
        return res.sendStatus(404);
    }

    shortUrl.clicks++
    shortUrl.save()

    console.log('Redirecting to:', shortUrl.full);
    res.redirect(shortUrl.full)
})

app.listen(port);
console.log(`server is listening on port number ${port}`)




// const express = require('express')
// const mongoose = require('mongoose')
// const ShortUrl = require('./models/shortUrl')
// const app = express()

// mongoose.connect('mongodb://127.0.0.1:27017/urlShortener', {
//     useNewUrlParser: true, useUnifiedTopology: true
// })

// app.set('view engine', 'ejs')
// app.use(express.urlencoded({ extended: false }))

// app.get('/', async (req, res) => {
//     const shortUrls = await ShortUrl.find()
//     res.render('index', { shortUrls: shortUrls })
// })

// app.post('/shortUrls', async (req, res) => {
//     await ShortUrl.create({ full: req.body.fullUrl })

//     res.redirect('/')
// })

// app.get('/:shortUrl', async (req, res) => {
//     const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
//     if (shortUrl == null) return res.sendStatus(404)

//     shortUrl.clicks++
//     shortUrl.save()

//     res.redirect(shortUrl.full)
// })

// app.listen(process.env.PORT || 5000);