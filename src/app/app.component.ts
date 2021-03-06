import { HelperService } from './services/helper-service/helper.service';
import { Component,ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  showloading: boolean = false;
  backgroundColor = 'rgba(255, 255, 255, 0.8)';
  @ViewChild('toast')
  toast: any;
  constructor(private _helper:HelperService) {
    this._helper.loading.subscribe(res=>{
      this.showloading = res;
    })
    this._helper.toastData.subscribe(res=>{
      if(res){
        this.toast.addToast(res);
      }
    })
  }

}
