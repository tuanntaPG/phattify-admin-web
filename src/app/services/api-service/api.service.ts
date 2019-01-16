import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_URL } from '../../constants/config';

@Injectable()
export class ApiService {
  url = SERVER_URL;
  constructor(private http: HttpClient) { }

  login(req) {
    const urlLogin = this.url + '/admin';
    return new Promise((resolve, reject) => {
      this.http.patch(urlLogin, req).subscribe(res => {
        resolve(res);
        console.log(res);
      }, err => {
        reject(err);
      });
    });
  }
  management(info) {
    const url = this.url + '/managementclient';
    return new Promise((resolve, reject) => {
      this.http.post(url, info).subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      });
    });
  }

  getSummary(req) {
    const urlAdmin = `${this.url}/admin?start=${req.startTime}&end=${req.endTime}`;
    return new Promise((resolve, reject) => {
      this.http.get(urlAdmin).subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      });
    });
  }

  resendCode(idClient) {
    const urlResend = this.url + '/resendCode';
    return new Promise((resolve, reject) => {
      this.http.post(urlResend, idClient).subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      });
    });
  }
  getListMentor() {
    const url = this.url + '/managementclient';
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      });
    });
  }
  deleteMentee(id) {
    const url = this.url + '/managementclient?id=' + id;
    return new Promise((resolve, reject) => {
      this.http.delete(url).subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      });
    });
  }
  getClientInfo(id) {
    const url = this.url + '/client-info?Id=' + id;
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      });
    });
  }
  changePassword(req, id) {
    const url = SERVER_URL + '/client-info?Id=' + id;
    return new Promise((resolve, reject) => {
      this.http.put(url, req).subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      });
    });
  }
  deleteRound(roundId) {
    const url = SERVER_URL + 'round?Id=' + roundId;
    return new Promise((resolve, reject) => {
      this.http.delete(url).subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      });
    });
  }
  assignMentor(req) {
    const url = SERVER_URL + 'managementclient';
    return new Promise((resolve, reject) => {
      this.http.put(url, req).subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      });
    });
  }
  getAllMentor(req) {
    const url = SERVER_URL + 'managementmentor';
    return new Promise((resolve, reject) => {
      this.http.post(url, req).subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      });
    });
  }
  searchMentee(q) {
    const url = SERVER_URL + 'managementmentor?search=' + q;
    return this.http.get(url);
  }
  getMentorInfo(id){
    const url = this.url + 'mentor-info?Id=' + id;
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      });
    });
  }
  downGradeMentor(id){
    const url = this.url + 'mentor-info?Id=' + id;
    return new Promise((resolve, reject) => {
      this.http.delete(url).subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      });
    });
  }
  blockMentor(id){
    const url = this.url + 'mentor-info?Id=' + id;
    return new Promise((resolve, reject) => {
      this.http.patch(url, id).subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      });
    });
  }
  addNewMentee(req){
    const url = SERVER_URL + 'mentor-info';
    return new Promise((resolve, reject) => {
      this.http.post(url, req).subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      });
    });
  }
  sendMail(req){
    const url = SERVER_URL + 'admin-email-compose';
    return new Promise((resolve, reject) => {
      this.http.post(url, req).subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      });
    });
  }
  adminAddClient(req){
    const url = SERVER_URL + 'admin-addclient';
    return new Promise((resolve, reject) => {
      this.http.post(url, req).subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      });
    });
  }

  adminUpdateClient(req) {
    const url = SERVER_URL + 'admin-addclient';
    return new Promise((resolve, reject) => {
      this.http.put(url, req).subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      });
    });
  }
  getCountries(){
    const url = SERVER_URL + 'country';
    return this.http.get(url);
  }
}
