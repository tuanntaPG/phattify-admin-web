import { Component, OnInit,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api-service/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { HelperService } from '../../../services/helper-service/helper.service';
import { GENDER, STATUS } from '../../../constants/config';
import { ValidateExtendService } from '../../../services/validate-service/validate-extend.service';
@Component({
  selector: 'app-list-mentee',
  templateUrl: './list-mentee.component.html',
  styleUrls: ['./list-mentee.component.scss']
})
export class ListMenteeComponent implements OnInit {
  @ViewChild('modalAddMentee')
  modalAddMentee:any;
  addClientForm:any;
  listMentee:any;
  changePasswordForm:any;
  idMentor:any;
  limit: number = 20;
  status: string = '';
  selectSort: any = '';
  page = 1;
  typeOrder: any = '';
  totalItem: number = 0;
  selectAll: any;
  @ViewChild('toast')
  toast: any;
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
  typeOrderBoolean: boolean;
  constructor(
     private router: ActivatedRoute,
    private _api: ApiService,
    private formBuilder: FormBuilder,
    private _helper: HelperService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.InitFormAddClient();
    this.router.params.subscribe(res => { 
      this.idMentor = res.id;
      this.getListMentee(res.id);
    })
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
    this.getListMentee(this.idMentor);
  }
  getListMentee(id){ 
    let data = {
      page: this.page,
      limit: this.limit,
      status: this.status,
      orderBy: this.selectSort,
      orderType: this.typeOrder,
      mentor: id,
      checked: false
    }
    this._api.management(data).then(res => { 
      this.listMentee = res['data']['clients'];
      this.totalItem = res['data']['totalItem']; 
      console.log(this.listMentee);
      
    })
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
    console.log(this.selectSort, this.typeOrderBoolean, this.typeOrder);

    this.getListMentee(this.idMentor);
  }
  changeAll(value) {
    console.log(value);

    if (this.listMentee) {
      if (value !== undefined) {
        for (let index = 0; index < this.listMentee.length; index++) {
          this.listMentee[index].checked = value;
        }
      }
    }
  }
  changeOne() {
    let count = 0;
    if (this.listMentee) {
      for (let i = 0; i < this.listMentee.length; i++) {
        if (this.listMentee[i].checked === true)
          count++;
      }
      this.selectAll = (count === this.listMentee.length || count === this.limit) ? true : false;
    }
  }
  addNewMentee(){ 
    let data = this.addClientForm.value;
    data['userId'] = this.idMentor;
    this._api.addNewMentee(data).then((res:any) => {
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