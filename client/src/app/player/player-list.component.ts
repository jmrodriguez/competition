import {Component, OnInit, AfterViewInit, ChangeDetectorRef, Input} from '@angular/core';
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

  private sub: any;
  total: Observable<number>;
  players: Observable<Player[]>;

  page: number = 1;
  terms: string = "";

  private searchTermStream = new Subject<string>();
  private pageStream = new Subject<number>();
  private federationStream = new Subject<Federation>();

  constructor(private route: ActivatedRoute,
              private playerService: PlayerService,
              private authorizationService: AuthService,
              private toastCommunicationService: ToastCommunicationService,
              private authService: AuthService,
              private federationService: FederationService) {
    this.sub = this.route.params.subscribe(params => {
      let page = params['page'];
      if (page != null) {
        this.page = +page; // (+) converts string 'id' to a number
      }

      let terms = params['q'];
      if (terms != null) {
        this.terms = params['q'];
      }
    });

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
        this._loadData();
      } else {
        this.toastCommunicationService.showToast(this.toastCommunicationService.ERROR, 'player.import.create.error');
        this._loadData();
      }
    };
  }

  ngOnInit() {
    this.showFederationSelect = this.authService.hasRole(["ROLE_SUPER_ADMIN", "ROLE_GENERAL_ADMIN"]);

    this._loadData();

    if (this.showFederationSelect) {
      this.federationService.list().subscribe((federationList: Federation[]) => {
        this.federationList = federationList;
      });
    }
  }

  private _loadData():void {
    const pageSource = this.pageStream.map(pageNumber => {
      this.page = pageNumber;
      return {search: this.terms, page: pageNumber, federation: this.selectedFederation}
    });

    const searchSource = this.searchTermStream
        .debounceTime(1000)
        .distinctUntilChanged()
        .map(searchTerm => {
          this.terms = searchTerm;
          return {search: searchTerm, page: 1, federation: this.selectedFederation}
        });

    const federationSource = this.federationStream.map(federation => {
      this.selectedFederation = federation;
      return {search: this.terms, page: 1, federation: this.selectedFederation};
    });

    const source = pageSource
        .merge(searchSource)
        .merge(federationSource)
        .startWith({search: this.terms, page: this.page, federation: this.selectedFederation})
        .mergeMap((params: {search: string, page: number, federation: Federation}) => {
          return this.playerService.list(null, params.search, params.page, params.federation)
        })
        .share();

    this.total = source.pluck('total');
    this.players = source.pluck('list');

  }

  search(terms: string) {
    this.searchTermStream.next(terms)
  }

  goToPage(page: number) {
    this.pageStream.next(page)
  }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  onFederationChange(newValue: Federation) {
    this.federationStream.next(newValue);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
