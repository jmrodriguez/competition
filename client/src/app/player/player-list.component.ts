import {Component, OnInit, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {PlayerService} from './player.service';
import {Player} from './player';
import {FileUploader} from "ng2-file-upload";
import {environment} from "../../environments/environment";
import {AuthService} from "../services/auth.service";
import {TranslateService} from '@ngx-translate/core';
import { FlashMessagesService } from 'ngx-flash-messages';
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

  private sub: any;
  total: Observable<number>;
  players: Observable<Player[]>;

  page: number = 1;
  terms: string = "";

  private searchTermStream = new Subject<string>();
  private pageStream = new Subject<number>();

  constructor(private route: ActivatedRoute,
              private playerService: PlayerService,
              private authorizationService: AuthService,
              private translateService: TranslateService,
              private flashMessagesService: FlashMessagesService) {
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
  }

  ngOnInit() {
    this._loadData();
  }

  private _loadData():void {
    const pageSource = this.pageStream.map(pageNumber => {
      this.page = pageNumber;
      return {search: this.terms, page: pageNumber}
    });

    const searchSource = this.searchTermStream
        .debounceTime(1000)
        .distinctUntilChanged()
        .map(searchTerm => {
          this.terms = searchTerm;
          return {search: searchTerm, page: 1}
        });

    const source = pageSource
        .merge(searchSource)
        .startWith({search: this.terms, page: this.page})
        .mergeMap((params: {search: string, page: number}) => {
          return this.playerService.list(params.search, params.page)
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
