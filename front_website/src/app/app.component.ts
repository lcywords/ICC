import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngx-admin';

  // test() {
  //   this.userService.deleteUser('dshfaiusdh').subscribe(data => {
  //     console.log(data);
  //   }, data => {
  //     console.log(data);
  //   }, () => {
  //     console.log('data');
  //   });
  //   // const res = this.httpClient.get('/user').subscribe(data => {
  //   //   console.log(data);
  //   // });
  //   // console.log(res);

  // }
}
