import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api-service/api.service';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { HelperService } from '../../services/helper-service/helper.service';
import * as moment from 'moment';
import { STATUS } from '../../constants/config';
@Component({
  selector: 'app-client-info',
  templateUrl: './client-info.component.html',
  styleUrls: ['./client-info.component.scss']
})
export class ClientInfoComponent implements OnInit {
  clientInfoForm: any;
  clientInfo: any = {};
  listMentor: any = [];
  healthList: any = [];
  checkResendCode: boolean;
  idClient: any;
  wipeData: boolean;
  checkShowDelete: boolean;
  checkShowWipeData: boolean;
  showAssignButton = false;
  @ViewChild('modalChangePassword')
  modalChangePassword: any;
  @ViewChild('toast')
  toast: any;
  @ViewChild('modalDelete')
  modalDelete: any;
  changePasswordForm: FormGroup;
  @ViewChild('modalAssign')
  modalAssign: any;
  mentorEmail: any;
  constructor(
    private router: ActivatedRoute,
    private _api: ApiService,
    private formBuilder: FormBuilder,
    private _helper: HelperService,
    private _router: Router
  ) {
    this.InitForm();
  }
  ngOnInit() {
    this.getClientInfo();
    this.getListMentor();
  }
  getClientInfo() {
    this.router.params.subscribe(res => {
      this.idClient = res.id
      this._api.getClientInfo(this.idClient).then(data => {
        this.clientInfo = data['data'];
        this.healthList = data['data']['Health'];
        console.log(this.clientInfo);
        this.checkResendCode = data['data']['Status'] !== 'active' ? false : true;
        this.wipeData = data['data']['RoundId'] ? true : false;
        this.fillDataClientInfo();
      })
    })
  }
  InitForm() {
    this.clientInfoForm = this.formBuilder.group({
      FirstName: ['', Validators.required],
      SurName: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      DateOfBirth: [{ value: '', disabled: true }],
      City: [{ value: '', disabled: true }],
      Status: [{ value: '', disabled: true }],
      mentor: [''],
      Gender: [{ value: '', disabled: true }],
      StartDate: [{ value: '', disabled: true }],
      StartWeight: [{ value: '', disabled: true }],
      CurrentWeight: [{ value: '', disabled: true }],
      CountryName: [{ value: '', disabled: true }],
      EndDate: [{ value: '', disabled: true }]
    })
    this.changePasswordForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', [confirmValidate, Validators.required]]
    })
  }
  fillDataClientInfo() {
    if (this.clientInfo) {
      this.clientInfoForm.setValue({
        FirstName: this.clientInfo.FirstName,
        SurName: this.clientInfo.SurName,
        email: this.clientInfo.Email,
        DateOfBirth: moment(this.clientInfo.DateOfBirth).format('YYYY-MM-DD'),
        City: this.clientInfo.City,
        mentor: this.clientInfo.MentorEmail,
        Status: this.clientInfo.Status ? this.clientInfo.Status : 'pending',
        Gender: this.clientInfo.Gender,
        StartDate: moment(this.clientInfo.StartDate).format('YYYY-MM-DD'),
        StartWeight: this.clientInfo.StartWeight,
        CurrentWeight: this.clientInfo.CurrentWeight,
        CountryName: this.clientInfo.CountryName,
        EndDate: moment(this.clientInfo.EndDate).format('YYYY-MM-DD')
      })
    }
  }
  getListMentor() {
    this._api.getListMentor().then(res => {
      this.listMentor = res['data'];
    }).catch(err => {

    })
  }
  resendCode() {
    const apiResendCode = {
      IdClient: this.idClient,
      IdMentor: this.idClient
    };
    this._api.resendCode(apiResendCode).then(res => {
      if (res['status'] === STATUS.error) {
        this.toast.addToast({ title: 'Message', msg: 'Can not resend code', timeout: 5000, theme: 'material', position: 'top-right', type: 'error' });
      } else {
        this.toast.addToast({ title: 'Message', msg: 'Resend code success', timeout: 5000, theme: 'material', position: 'top-right', type: 'success' });
      }
    }).catch(err => {
      console.log(err);
    })
  }
  showModalChangePassword() {
    this.changePasswordForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', [confirmValidate, Validators.required]]
    })
    this.modalChangePassword.show();
  }
  changePassword() {
    this.modalChangePassword.hide();
    let data = {
      "password": this.changePasswordForm.value.password
    }
    this._helper.toggleLoadng(true);
    this._api.changePassword(data, this.idClient).then(res => {
      this._helper.toggleLoadng(false);
      if (res['status'] === STATUS.error) {
        this.toast.addToast({ title: 'Message', msg: 'Can not change password', timeout: 5000, theme: 'material', position: 'top-right', type: 'error' });
      } else {
        this.toast.addToast({ title: 'Message', msg: 'Change password success', timeout: 5000, theme: 'material', position: 'top-right', type: 'success' });
      }
    }).catch(err => {
      console.log(err)
    })
  }
  confirmDelete(type) {
    if (type === 'wipeData' && this.wipeData) {
      this.checkShowDelete = false;
      this.checkShowWipeData = true;
      this.modalDelete.show();
    } else if (type === 'delete') {
      this.checkShowDelete = true;
      this.checkShowWipeData = false;
      this.modalDelete.show();
    } else if (!this.wipeData) {
      this.toast.addToast({ title: 'Message', msg: 'Delete round error, do not have round is running', timeout: 5000, theme: 'material', position: 'top-right', type: 'error' });
    }
  }
  hideDelete() {
    this.checkShowDelete = false;
    this.checkShowWipeData = false;
    this.modalDelete.hide();
  }
  delete() {
    this.modalDelete.hide();
    this._helper.toggleLoadng(true);
    this._api.deleteMentee(this.clientInfo.Id).then((res: any) => {
      this.checkShowDelete = false;
      this._helper.toggleLoadng(false);
      if (res.status == STATUS.error) {
        this.toast.addToast({ title: 'Message', msg: res.message, timeout: 5000, theme: 'material', position: 'top-right', type: 'error' });
      } else {

        this.toast.addToast({ title: 'Message', msg: 'Delete Client Success', timeout: 2000, theme: 'material', position: 'top-right', type: 'success' });
        setTimeout(() => {
          this._router.navigate(['/client-management'])
        }, 2000)
      }
    }).catch(err => {
      this._helper.toggleLoadng(true);
    })
  }
  deleteRound() {
    this.modalDelete.hide();
    this._helper.toggleLoadng(true);
    if (this.clientInfo.RoundId) {
      this._api.deleteRound(this.clientInfo.RoundId).then((res: any) => {
        this.checkShowWipeData = false;
        this._helper.toggleLoadng(false);
        if (res.status == STATUS.error) {
          this.toast.addToast({ title: 'Message', msg: 'Delete round error', timeout: 5000, theme: 'material', position: 'top-right', type: 'error' });
        } else {
          this.toast.addToast({ title: 'Message', msg: 'Delete round Success', timeout: 5000, theme: 'material', position: 'top-right', type: 'success' });
          this.getClientInfo();
        }
      }, err => {
        console.log(err)
        this._helper.toggleLoadng(false);
      })
    }
  }
  assignMentor() {
    let data = {
      'MentorId': this.clientInfoForm.value.mentor,
      'MenteeId': this.idClient
    }
    this._helper.toggleLoadng(true);
    this._api.assignMentor(data).then((res: any) => {
      this._helper.toggleLoadng(false);
      if (res.status == STATUS.error || res.data == 'not ok') {
        this.modalAssign.hide();
        this.toast.addToast({ title: 'Message', msg: 'Assign Mentor error', timeout: 5000, theme: 'material', position: 'top-right', type: 'error' });
      } else {
        this.modalAssign.hide();
        this.toast.addToast({ title: 'Message', msg: 'Assign mentor successfully', timeout: 5000, theme: 'material', position: 'top-right', type: 'success' });
        this.getClientInfo();
      }
    }, err => {
      console.log(err);
      this.modalAssign.hide();
      this._helper.toggleLoadng(false);
    })
  }
  showModalAssign() {
    if(this.clientInfoForm.value.mentor){ 
      this.mentorEmail = this.listMentor.find(x => x.value === this.clientInfoForm.value.mentor)
      this.modalAssign.show();
    } else { 
      this.toast.addToast({ title: 'Message', msg: 'You must select email', timeout: 5000, theme: 'material', position: 'top-right', type: 'error' });
    }
  }
}

export function confirmValidate(control: AbstractControl) {
  if (control && control.value !== null) {
    const confirmPassword = control.value;
    const pass = control.root.get('password');
    if (pass) {
      const password = pass.value;

      if (password !== confirmPassword) {
        return {
          isError: true,
        };
      }
    }
  }
  return null;
}