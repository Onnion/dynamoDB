'use strict'

const dynamoose = require('dynamoose');
const moment = require('moment');
const Hache = require('hache');
const itensToPopulate = require('./json/cachesearch/cachesearch.json')
const Schema = dynamoose.Schema;


const keys = require("../keys.json")
dynamoose.AWS.config.update({
      accessKeyId: keys.acess,
      secretAccessKey: keys.secret,
      region: 'sa-east-1'
});

// Create Companie Schema
const cacheSearchchema = new Schema({
      cache_id: {
            type: String,
            hashKey: true,
            required: true
      },
      updated_at: {
            type: String,
      },
      created_at: {
            type: String,
            rangeKey: true
      },
      uses: {
            type: Number,
            required: true,
            default: 1
      },
      search: {
            type: Object
      },
      flights: [Object],
      flights_back: [Object],
      throughput: {
            read: 100000,
            write: 100000
      }
});

function generateCacheId (search) {

      var hache = new Hache('md5');

      let departureDate = search.getDepartureDate().format('YYYY-MM-DD');
      let returnDate = (search.getReturnDate() ? search.getReturnDate().format('YYYY-MM-DD') : '0000-00-00');

      var searchString =
            search.company +
            search.origin_airport +
            search.destination_airport +
            search.adults +
            search.children +
            search.babies +
            departureDate +
            returnDate +
            search.type_trip +
            search.modality;

      return hache.encode(searchString);

};

cacheSearchchema.methods.addCache = function (result) {

      this.search = result.search;
      this.flights = result.flights;
      this.flights_back = result.flights_back;
      this.cache_id = this.generateCacheId(result.search);

};

let normalizeFlights = function (flights) {
      let newFlights = null;

      if (flights) {
            newFlights = JSON.parse(JSON.stringify(flights));

            for (let flight of newFlights) {

                  flight.departure_date = moment(flight.departure_date).format('YYYY-MM-DD HH:mm:ss');
                  flight.arrival_date = moment(flight.arrival_date).format('YYYY-MM-DD HH:mm:ss');

                  if (flight.connections) {
                        for (let connection of flight.connections) {
                              connection.departure_date = moment(connection.departure_date).format('YYYY-MM-DD HH:mm:ss');
                              connection.arrival_date = moment(connection.arrival_date).format('YYYY-MM-DD HH:mm:ss');
                        }
                  }

                  if (flight.prices) {
                        let prices = [];
                        for (let price of flight.prices) {
                              price.boarding = price._boarding;
                              delete price._boarding;
                              prices.push(price);
                        }

                        flight.prices = prices;
                  }

            }
      }

      return newFlights;
};

cacheSearchchema.methods.normalizeCache = function () {

      var flights = normalizeFlights(this.flights);
      var flights_back = normalizeFlights(this.flights_back);

      return {
            search: this.search,
            flights,
            flights_back
      };

};

// Export CacheSearch Model
//module.exports = dynamoose.model('CacheSearch', cacheSearchchema);











// Testing
let CacheSearch = dynamoose.model('cachetest', cacheSearchchema, { update: true });

// Populate Model CacheSearch
function populateCacheSearchModel() {
      
      var cont = 0

      itensToPopulate.forEach(function (summary) {

            // Create a new object
            var searchSummary = new CacheSearch({

                  cache_id: summary.cache_id,
                  uses: summary.uses,
                  search: summary.search,
                  flights: summary.flights,
                  flights_back: summary.flights_back,
                  updated_at: summary.updated_at,
                  created_at: summary.created_at,

            });

            // Save to DynamoDB    
            setTimeout(function () {

                  searchSummary.save(function (a) {
                        cont++;
                        console.log(cont, a);
                  });

            }, 2000)

      });
}

populateCacheSearchModel();
CacheSearch.query('cache_id').eq('Q-mrvCz0874DhJUxr3pePQ').exec().then( (res) => {
      console.log('res',res);
}).catch( (err) => {
      console.log('err',err);
});






