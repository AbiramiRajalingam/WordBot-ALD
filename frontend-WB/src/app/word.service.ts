import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WordService {

  constructor(private http: HttpClient) { }

  url = 'https://twinword-word-associations-v1.p.rapidapi.com/associations/';
  

  dataFinal: any = [];

  getAlternateWord() {
    var axios = require("axios").default;

    var options = {
      method: 'GET',
      url: 'https://twinword-word-associations-v1.p.rapidapi.com/associations/',
      params: { entry: 'sound' },
      headers: {
        'x-rapidapi-host': 'twinword-word-associations-v1.p.rapidapi.com',
        'x-rapidapi-key': '4516d8f8ecmsh515b482a97a3ba3p1b5b4bjsn024ff27b5543'
      }
    };

    axios.request(options).then(function (response: { data: any; }) {
      console.log(response.data);
    }).catch(function (error: any) {
      console.error(error);
    });
  }


  getJobDescriptions() {
    return this.http.get(environment.baseURL+'jobDesc')

  }

  sendSample(samplejobreq: any) {
    return this.http.post<any>(environment.baseURL+'enterData', samplejobreq)
  }

  getBotDetails() {
    return this.http.get(environment.baseURL+'wordbotDetails')

  }

  getViewDbData() {
    return this.http.get(environment.baseURL+'viewData')

  }

  deleteData(deleteDatareq:any){
    return this.http.post<any>(environment.baseURL+'deleteRecord', deleteDatareq)
  }

  editData(editDatareq:any){
    return this.http.post<any>(environment.baseURL+'editData',editDatareq)
  }

  changePwd(pwdData:any){
    return this.http.post<any>(environment.baseURL+'loginData',pwdData)
  }

  loginValidation(){
    return this.http.get(environment.baseURL+'validateLogin')
  }


}
