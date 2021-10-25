const { Model } = require('cores/Model')
var _ = require('underscore');
const axios = require('axios');

Array.prototype.randomizer = function(){
    return this[Math.floor(Math.random()*this.length)];
}

class DrinksController extends Model {
  constructor() {
    super()
    this.coffeeUrl= 'https://api.sampleapis.com/coffee/hot';
    this.coffeeImgUrl= 'https://coffee.alexflipnote.dev/random.json';
    this.beerUrl= 'https://api.sampleapis.com/beers/ale';
  }

  async controller(req, res, next) {
    const type= req.query.type;
      if(type && type.toLowerCase() === 'coffee'){
        this.getCoffee()
        .then((response) =>{
          res.send(response)          
        })
        .catch(function (error) {
          console.log(error);
        });
      }
      else if(type && type.toLowerCase() === 'beer'){
          this.getBeer()
          .then((response) =>{
            res.send(response)
          })
          .catch(function (error) {
            console.log(error);
          });
      }
      else{
        Promise.all([this.getCoffee(), this.getBeer()]).then(function(values) {
          let coffee= _.sortBy( values[0], 'rating' ).reverse(), beer= _.sortBy( values[1], 'rating' ).reverse();
          res.send({ coffee, beer })
        });
      }  
  }

  getCoffeeApi(){
    return axios.get(this.coffeeUrl)
  }
  getCoffeeImg(){
    return axios.get(this.coffeeImgUrl)
  }
  getBeerApi(){
    return axios.get(this.beerUrl)
  }
  getCoffee(){
    let coffeeResponse= Promise.all([this.getCoffeeApi(), this.getCoffeeImg()]).then((response) =>{
      let coffeeRes= response[0]['data'];
      let coffeeImgRes= response[1]['data'];
      let coffeeImg= coffeeImgRes['file'];
      coffeeRes= coffeeRes.map(x=>{
        return this.coffeeData(x, coffeeImg);          
      })
      return coffeeRes
    });
    return coffeeResponse
  }
  getBeer(){
    let beerResponse= this.getBeerApi()
          .then((response) =>{
              let data= response['data'];  
              data= data.map(x=>{
                return this.beerData(x);          
              })
            return data              
          });
    return beerResponse
  }
  getPrice(){
    //Range between $8-$20
    return [...Array(13).keys()].map(i => i + 8).randomizer()
  }
  getRating(){
    //Range between 1-5
    return [...Array(5).keys()].map(i => i + 1).randomizer()
  }
  coffeeData(record, coffeeImg){
    let price= this.getPrice(), rating= this.getRating();
    return {'name': record['title'] || null, 'price': `$${price}`, 'rating': rating,
     'description': record['description'] || null, 'image': coffeeImg, 'id': this.stringToUuid(record['id'].toString())}
  }
  beerData(record){
    let name= record['name'] || null,
        price= record['price'] || null,
        rating= record['rating']['average'] || null,
        description= record['name'] || null,
        image= record['image'] || null,
        id= this.stringToUuid(record['id'].toString()) || null;
    return { name, price, rating, description, image, id}
  }
  stringToUuid(str) {
    str = str.replace('-', '');
    return 'xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, function(c, p) {
      return str[p % str.length];
    });
  }
}

module.exports = { DrinksController }
