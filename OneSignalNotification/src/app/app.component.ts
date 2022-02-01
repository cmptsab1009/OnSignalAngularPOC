import { Component } from '@angular/core';
import { OneSignalService } from 'onesignal-ngx';
import { OnesignalserviceService } from './onesignalservice.service';
import { CreateNotificationTokenCommand } from './_model/CreateNotificationTokenCommand';
import * as $ from 'jquery';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'OneSignalNotification';
  onesignalMessage: string;
  notificationTokenCommand: CreateNotificationTokenCommand;
  tokenKey: string = '';
  public notifications: BehaviorSubject<any> = new BehaviorSubject([]);
  totalUnreadNotification: number = 0;
  constructor(private oneSignal: OnesignalserviceService) {
    // this.oneSignal.init({
    //     appId: "0a749872-a713-4734-affa-8c7aef18e28b",
    // });
  }
  ngOnInit() {
    this.tokenKey = JSON.parse(localStorage.getItem('UserId'));
    //console.log(this.tokenKey);
    //this.SaveUserId();
    // setInterval(() => {
    //   let event = {
    //     content: 'Test',
    //     header: 'This is test notification please ignore..',
    //     read: false,
    //   };
    //   this.notifications.next([...this.notifications.value, event]);
    //   console.log(this.notifications.value);
    //   this.totalUnreadNotification = this.notifications.value.filter((x) => !x.read).length;
    // }, 5000);
    this.signalOneInit();
    this.notificationPanel();
  }

  notificationPanel() {
    $(document).ready(() => {
      var down = false;
      $('#bell').click((e) => {
        var color = $(this).text();
        if (down) {
          $('#box').css('height', '0px');
          $('#box').css('opacity', '0');
          down = false;
        } else {
          $('#box').css('height', 'auto');
          $('#box').css('opacity', '1');
          down = true;
          this.notifications.value.forEach((element) => {
            element.read = true;
          });
          this.totalUnreadNotification = 0;
        }
      });
    });
  }
  SaveUserId() {
    this.notificationTokenCommand = new CreateNotificationTokenCommand('Web', this.tokenKey);

    this.oneSignal.saveUserIdasToken(this.notificationTokenCommand).subscribe(
      (response) => {
        debugger;
        console.log(response);
        debugger;
        if (response != null) {
          this.onesignalMessage = ' saved in DB.'; // this.messagingService.currentMessage;
        }
        //this.submitted = true;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  signalOneInit() {
    window.OneSignal = window.OneSignal || [];
    // OneSignal.push(function() {
    //   debugger;
    //   console.log("inside push");
    //   OneSignal.init({
    //     appId: "0a749872-a713-4734-affa-8c7aef18e28b",

    //   });

    // });
    console.log('push initialize');
    window.OneSignal.push([
      'init',
      {
        appId: '0a749872-a713-4734-affa-8c7aef18e28b',
        autoRegister: false,
        allowLocalhostAsSecureOrigin: true,
        notifyButton: {
          enable: false,
        },
      },
    ]);
    console.log('push initialized');

    window.OneSignal.push(function () {
      console.log('Register For Push');
      window.OneSignal.push(['registerForPushNotifications']);
    });
    //ExternalUserId( - logged in user id - Type - GUID
    window.OneSignal.push(function () {
      window.OneSignal.setExternalUserId('3bb306e5-2aae-4769-adda-9badf26afead', 'F4CE1FBFFFD02B1426E5F75EA74307387F4E0978A9A37E4844733D80B20FE941');
      console.log('Registered For external user id in Onesignal as "3bb306e5-2aae-4769-adda-9badf26afead"');
      window.OneSignal.push(['registerForPushNotifications']);
    });

    window.OneSignal.push(() => {
      // Occurs when the user's subscription changes to a new value.
      window.OneSignal.getUserId().then((userId) => {
        //console.log("User ID is", userId);
      });
      window.OneSignal.push(() => {
        window.OneSignal.on('notificationDisplay', (event) => {
          debugger;
          event['read'] = false;
          console.warn('OneSignal notification displayed:', event);
          this.notifications.next([...this.notifications.value, event]);
          console.log(this.notifications.value);
          this.totalUnreadNotification = this.notifications.value.filter((x) => !x.read).length;
          console.log(event.heading);
          console.log(event.content);
        });

        //This event can be listened to via the `on()` or `once()` listener
      });
      window.OneSignal.on('subscriptionChange', function (isSubscribed) {
        console.log("The user's subscription state is now:", isSubscribed);
        window.OneSignal.getUserId().then(function (userId) {
          console.log('User ID is', userId);
          // localStorage.setItem("UserId",userId);
        });
      });
    });
  }
}
