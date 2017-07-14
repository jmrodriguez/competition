import {Component, OnInit, AfterViewInit, ChangeDetectorRef, Input, ViewChild} from '@angular/core';
import {PlayerService} from './player.service';
import {Player} from './player';
import {FileUploader} from "ng2-file-upload";
import {environment} from "../../environments/environment";
import {AuthService} from "../services/auth.service";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {ActivatedRoute} from "@angular/router";
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/pluck';
import {Federation} from "../federation/federation";
import {FederationService} from "app/federation/federation.service";
import {ToastCommunicationService} from "../shared/toast-communication.service";
import {PlayerDataSource} from "./player.datasource";
import {MdPaginator, MdSort} from "@angular/material";
import {Tournament} from "../tournament/tournament";
import {delay} from "rxjs/operator/delay";

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
  showFederationSelect:boolean;
  federationList: Federation[];
  selectedFederation: Federation;

  displayedColumns = ['id', 'firstName', 'lastName', 'email', 'dni', 'club', 'birth'];
  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild(MdSort) sort: MdSort;

  playerDatasource: PlayerDataSource | null;

  private searchTermStream = new Subject<string>();
  private federationStream = new Subject<Federation>();
  private tournamentStream = new Subject<Tournament>(); // unused but necessary
  private playerTypeStream = new Subject<number>(); // unused but necessary

  constructor(private route: ActivatedRoute,
              private playerService: PlayerService,
              private authorizationService: AuthService,
              private toastCommunicationService: ToastCommunicationService,
              private authService: AuthService,
              private federationService: FederationService) {

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

        this.toastCommunicationService.showToast(this.toastCommunicationService.SUCCESS, 'player.import.create.success', {value: responseObj.totalCreated});
      } else {
        this.toastCommunicationService.showToast(this.toastCommunicationService.ERROR, 'player.import.create.error');
      }
      // refresh the list
      this.federationStream.next(null);
    };
  }

  ngOnInit() {
    this.playerDatasource = new PlayerDataSource(this.tournamentStream, this.federationStream, this.searchTermStream, this.playerTypeStream, this.paginator, this.sort, this.playerService);

    if (this.authService.hasRole(["ROLE_FEDERATION_ADMIN"])) {
      // listen to datasource connection to trigger initial search
      this.playerDatasource.connectionNotifier.subscribe((connected: boolean) => {
        if (connected) {
          // TRIGGER THE INITIAL SEARCH. We could use any subject for this purpose
          this.federationStream.next(null);
        }
      });
    }

    this.showFederationSelect = this.authService.hasRole(["ROLE_SUPER_ADMIN", "ROLE_GENERAL_ADMIN"]);

    if (this.showFederationSelect) {
      this.federationService.list().subscribe((federationList: Federation[]) => {
        this.federationList = federationList;
      });
    }
  }

  search(terms: string) {
    this.searchTermStream.next(terms)
  }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  onFederationChange(newValue: Federation) {
    this.federationStream.next(newValue);
  }
}
