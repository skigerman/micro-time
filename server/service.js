'use strict';

require('dotenv').config();

const express = require('express');
const service = express();
const geoApiKey = process.env.GEO_API_KEY;
const tzApiKey = process.env.TZ_API_KEY;
const request = require('superagent');
const moment = require('moment');

//https://maps.googleapis.com/maps/api/timezone/json?location=38.908133,-77.047119&timestamp=1458000000&key=tzApiKey
//https://maps.googleapis.com/maps/api/geocode/json?address=vienna&key=geoApiKey

service.get('/service/:location', (req, res, next) => {

    request.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + req.params.location + '&key=' + geoApiKey, (err, response) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }

        const location = response.body.results[0].geometry.location;
        const timestamp = +moment().format('X');

        request.get('https://maps.googleapis.com/maps/api/timezone/json?location=' + location.lat + ',' + location.lng + '&timestamp=' + timestamp + '&key=' + tzApiKey, (err, response) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }

            const result = response.body;

            const timeString = moment.unix(timestamp + result.dstOffset + result.rawOffset).utc().format('dddd, MMMM Do YYYY, h:mm:ss a');

            res.json({result: timeString});
        });
    });
    
});

    module.exports = service;