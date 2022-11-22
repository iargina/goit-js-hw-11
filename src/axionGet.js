
'use strict';
import axios from 'axios';

export class AxiosGet {
    #APIKEY = '31492838-594d4712a7022807875a451bd'
#BASEURL = 'https://pixabay.com/api/'

constructor() {
    this.page = null;
    this.q = null;

}

getPhoto(){
    const options = { params:{
        key: this.#APIKEY,
        orientation: 'horizontal',
        q: this.q,
        image_type: 'photo',
        safesearch: true,
        page: this.page,
        per_page: '40'
    }}
   return  axios.get(`${this.#BASEURL}`,options)
    
}
}