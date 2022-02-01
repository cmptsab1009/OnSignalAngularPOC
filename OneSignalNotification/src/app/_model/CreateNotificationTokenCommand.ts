export class CreateNotificationTokenCommand{
    //tenantID:string;
    deviceType:string;
    token:string;

    constructor(dvType : string,tkn : string)
    {
      //this.tenantID=tID;
      this.deviceType=dvType;
      this.token=tkn;
    }
}