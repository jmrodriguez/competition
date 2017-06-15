import {Component, Input, OnInit} from '@angular/core';
import {PlayerService} from './player.service';
import {Player} from './player';
import {FileUploader} from "ng2-file-upload";
import {environment} from "../../environments/environment";
import {AuthService} from "../services/auth.service";
import {TranslateService} from '@ngx-translate/core';
import { FlashMessagesService } from 'ngx-flash-messages';

@Component({
  selector: 'player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css']
})
export class PlayerListComponent implements OnInit {

  private uploadEndpoint:string = "player/upload"
  public allowedMimeType:string[] = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
  public uploader:FileUploader;
  public hasBaseDropZoneOver:boolean = false;

  playerList: Player[] = [];

  constructor(private playerService: PlayerService,
              private authorizationService: AuthService,
              private translateService: TranslateService,
              private flashMessagesService: FlashMessagesService) { }

  ngOnInit() {
    this.uploader = new FileUploader({
      url: environment.serverUrl + this.uploadEndpoint,
      allowedMimeType: this.allowedMimeType,
      headers: [{ name: 'Authorization', value : 'Bearer ' + this.authorizationService.currentUser.access_token } ]
    });
    this.uploader.onAfterAddingFile = (fileItem) => {
      this.uploader.clearQueue();
      this.uploader.queue[0] = fileItem;
    };

    this.uploader.onCompleteItem = (fileItem, response, status, headers) => {

      if (status == 201 && response != null) {
        let responseObj = JSON.parse(response);
        this.translateService.get('player.import.create.success', {value: responseObj.totalCreated}).subscribe((res: string) => {
          this.flashMessagesService.show(res, { classes: ['alert-success'], timeout: 5000 });
          this._loadData();
        });
      } else {
        this.translateService.get('player.import.create.error', {}).subscribe((res: string) => {
          this.flashMessagesService.show(res, { classes: ['alert-danger'], timeout: 5000 });
          this._loadData();
        });
      }
    };

    this._loadData();
  }

  private _loadData():void {
    this.playerService.list().subscribe((playerList: Player[]) => {
      this.playerList = playerList;
    });
  }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

}
