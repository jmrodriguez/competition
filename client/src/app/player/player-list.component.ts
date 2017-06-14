import {Component, Input, OnInit} from '@angular/core';
import {PlayerService} from './player.service';
import {Player} from './player';
import {FileUploader} from "ng2-file-upload";
import {environment} from "../../environments/environment";


@Component({
  selector: 'player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css']
})
export class PlayerListComponent implements OnInit {

  private uploadEndpoint:string = "/user/upload"
  public uploader:FileUploader = new FileUploader({url: environment.serverUrl + this.uploadEndpoint});
  public hasBaseDropZoneOver:boolean = false;

  playerList: Player[] = [];

  constructor(private playerService: PlayerService) { }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (fileItem) => {
      this.uploader.clearQueue();
      this.uploader.queue[0] = fileItem;
    };
    this.playerService.list().subscribe((playerList: Player[]) => {
      this.playerList = playerList;
    });
  }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  /*onFileDrop(file: File) {
    this.uploader.clearQueue();
    let fileList = [];
    fileList.push(file);
    this.uploader.addToQueue(fileList);
  }

  onUploaderSelectChange(file: File) {
    this.uploader.clearQueue();
    let fileList = [];
    fileList.push(file);
    this.uploader.addToQueue(fileList);
  }*/

}
