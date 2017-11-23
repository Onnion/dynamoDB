'use strict'

var moment = require("moment");
const Promise = require('bluebird');
const SearchSummary = require('../tables/searchsummaries/dynamoose/SearchSummaries');
const CacheSearch = require('../tables/CacheSearch/dynamoose/CacheSearch');

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

let dailySearches = function () {

        return new Promise((resolve) => {

                let minDate = moment().subtract(1, 'day').startOf('day'); //consultas do dia anterior
                let maxDate = moment().subtract(1, 'day').endOf('day');

                CacheSearch
                        .aggregate([
                                {
                                        $match: {
                                                "created_at": { '$gte': minDate.toDate(), '$lte': maxDate.toDate() }
                                        }
                                },
                                {
                                        $group: {
                                                "_id": "$search.company",
                                                "company": { "$first": "$search.company" },
                                                "count": { "$sum": 1 },
                                                "count_with_cache": { "$sum": "$uses" },
                                                "duration": { "$sum": "$search.duration" }
                                        }
                                }])
                        .then((result) => {
                                resolve(result);
                        });
        });

};

findSearchesTwoDaysBefore();
dailySearches();