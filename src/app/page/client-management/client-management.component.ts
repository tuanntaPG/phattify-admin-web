import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api-service/api.service';
import { HelperService } from '../../services/helper-service/helper.service';
import { STATUS, GENDER } from '../../constants/config';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidateExtendService } from '../../services/validate-service/validate-extend.service';
@Component({
  selector: 'app-client-management',
  templateUrl: './client-management.component.html',
  styleUrls: ['./client-management.component.scss'],
})
export class ClientManagementComponent implements OnInit {
  page = 1;
  searchInput: any = '';
  selectInput = '';
  listClient: any;
  selectSort: any = '';
  selectAll: any;
  selectActiveUser = 'Active';
  typeOrder: any = '';
  typeOrderBoolean: boolean;
  status: string = '';
  type: string = '';
  numPages = 10;
  listUser: any;
  totalItem: number = 0;
  limit: number = 20;
  listMentor: any = [];
  mentor: string = '';
  deleteFlag: any;
  tbAll = false;
  @ViewChild('modalDelete')
  modalDelete: any;
  @ViewChild('toast')
  toast: any;
  @ViewChild('modalAddMentee')
  modalAddMentee:any;
  addClientForm:any;
  listGender: any = [
    {
      name: 'Male',
      value: GENDER.Male
    },
    {
      name: 'Female',
      value: GENDER.Female
    }
  ]
  constructor(
    private _api: ApiService,
    private _helper: HelperService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.getListClient();
    this.getListMentor();
    this.InitFormAddClient();
    // this.listMentor = [
    //   { value: '0', label: 'Alabama' },
    //   { value: '1', label: 'Wyoming' },
    //   { value: '2', label: 'Coming' },
    //   { value: '3', label: 'Henry Die' },
    //   { value: '4', label: 'John Doe' }
    // ];
  }
  InitFormAddClient(){ 
    this.addClientForm = this.formBuilder.group({ 
      firstName: ['', Validators.required],
      surName: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required,Validators.email]],
      confirmEmail: ['', [Validators.required]],
      dateOfBirth: ['', Validators.required],
      contactNumber: [''],
      note: ['']
    },{ validator: ValidateExtendService.matchingEmail('email', 'confirmEmail') })
  }
  onChangePage(event) {
    this.selectAll = false;
    this.getListClient();
  }

  getListClient() {
    const data = {
      search: this.searchInput,
      page: this.page,
      limit: this.limit,
      status: this.status,
      orderBy: this.selectSort,
      orderType: this.typeOrder,
      mentor: this.mentor,
      checked: false
    };
    console.log(data);
    
    this._api.management(data).then(res => {
      this.listClient = res['data']['clients']
      this.totalItem = res['data']['totalItem'];
      console.log(res);
      
    }).catch(err => {
      console.log(err);
    })
  }
  showAll() {
    this.searchInput = '';
    this.page = 1;
    this.type = '';
    this.status = '';
    this.mentor = '';
    this.getListClient();
  }
  searchTable() {
    this.page = 1;
    this.getListClient();
  }
  sortTable(data) {
    this.selectSort = data;
    if (this.typeOrderBoolean == false || '') {
      this.typeOrder = "desc";
      this.typeOrderBoolean = true;
    }
    else {
      this.typeOrder = "asc";
      this.typeOrderBoolean = false;
    }
    this.getListClient()
  }
  resendCode(idClient) {
    const apiResendCode = {
      IdClient: idClient,
      IdMentor: idClient
    };
    this._api.resendCode(apiResendCode).then(res => {
      this.getListClient()
    }).catch(err => {
      console.log(err);
    })
  }
  getListMentor() {
    this._api.getListMentor().then(res => {
      this.listMentor = res['data'];
    }).catch(err => {

    })
  }
  confirmDelete(client) {
    this.deleteFlag = client;
    this.modalDelete.show();
  }
  delete() {
    this.modalDelete.hide();
    this._helper.toggleLoadng(true);
    this._api.deleteMentee(this.deleteFlag.Id).then((res: any) => {
      this._helper.toggleLoadng(false);
      if (res.status == STATUS.error) {
        this.toast.addToast({ title: 'Message', msg: res.message, timeout: 5000, theme: 'material', position: 'bottom-right', type: 'error' });
      } else {
        this.getListClient();
        this.toast.addToast({ title: 'Message', msg: 'Delete Client Success', timeout: 5000, theme: 'material', position: 'bottom-right', type: 'success' });
      }
    }).catch(err => {
      this._helper.toggleLoadng(true);
    })
  }

  changeAll(value) {
    if (this.listClient) {
      if (value !== undefined) {
        for (let index = 0; index < this.listClient.length; index++) {
          this.listClient[index].checked = value;
        }
      }
    }
  }

  changeOne() {
    let count = 0;
    if (this.listClient) {
      for(let i = 0; i < this.listClient.length;i++){ 
        if(this.listClient[i].checked === true)
        count++;
      }
      this.selectAll = (count === this.listClient.length || count === this.limit)  ? true : false;
    }
  }
  goToClientInfo(id) {
    this.router.navigate(['client-info',id]);
  }
  addNewMentee(){ 
    let data = this.addClientForm.value;
    data['userID'] = "e7864830-39a9-4c7b-87cd-787c6132019c";
    this._api.addNewMentee(data).then((res:any) => {
      console.log(data);
      
      if(res.status == 'error'){ 
        this.toast.addToast({ title: 'Message', msg: res.message, timeout: 5000, theme: 'material', position: 'top-right', type: 'error' });
      } else { 
        this.toast.addToast({ title: 'Message', msg: "Successfully", timeout: 5000, theme: 'material', position: 'top-right', type: 'success' });
        this.addClientForm.reset();
        this.modalAddMentee.hide();
      } 
    })
  }
}
