'use strict'

let moment = require("moment");
let db = require('./database');  //Connexão com DynamoDB

console.log(db);
const SearchSummary = require('./entities/searchsummaries/SearchSummaries');

// return searchsummaries 2 days before
let findSearchesTwoDaysBefore = function () {
        return new Promise((resolve) => {
                let minDateTwoDays = moment().subtract(2, 'day').startOf('day').toDate().toISOString();
                let maxDateTwoDays = moment().subtract(2, 'day').endOf('day').toDate().toISOString();

                SearchSummary.scan('created_at').between(minDateTwoDays, maxDateTwoDays).exec()
                        .then(function (searchsummary) {
                                console.log(searchsummary);
                                resolve(searchsummary);
                        })
                        .catch(function (err) {
                                console.error('err', err);
                        });
        })
};

findSearchesTwoDaysBefore();
//dailySearches();