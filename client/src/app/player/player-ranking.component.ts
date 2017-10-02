import {Component, OnInit, AfterViewInit, ChangeDetectorRef, Input, ViewChild} from '@angular/core';
import {PlayerService} from './player.service';
import {FileUploader} from "ng2-file-upload";
import {environment} from "../../environments/environment";
import {AuthService} from "../services/auth.service";
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
import {ListResult} from "../helpers/list-result.interface";
import {Category} from "../category/category";
import {CategoryService} from "../category/category.service";

@Component({
  selector: 'player-ranking',
  templateUrl: './player-ranking.component.html',
  styleUrls: ['./player-ranking.component.css']
})
export class PlayerRankingComponent implements OnInit {

  private uploadEndpoint:string = "player/upload"
  public allowedMimeType:string[] = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
  public uploader:FileUploader;
  public hasBaseDropZoneOver:boolean = false;
  showFederationSelect:boolean;
  federationList: Federation[];
  selectedFederation: Federation;
  categoryList: Category[];
  selectedCategory: Category;
  rankingField: string = "ranking";
  pointsField: string = "points";

  displayedColumns = ['ranking', 'points', 'id', 'firstName', 'lastName', 'email', 'dni', 'club', 'birth'];
  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild(MdSort) sort: MdSort;

  @Input() terms = "";

  playerDatasource: PlayerDataSource | null;

  private searchTermStream = new Subject<string>();
  private federationStream = new Subject<Federation>();
  private categoryStream = new Subject<Category>();
  private tournamentStream = new Subject<Tournament>(); // unused but necessary
  private playerTypeStream = new Subject<number>(); // unused but necessary

  constructor(private route: ActivatedRoute,
              private playerService: PlayerService,
              private authorizationService: AuthService,
              private toastCommunicationService: ToastCommunicationService,
              private authService: AuthService,
              private federationService: FederationService,
              private categoryService: CategoryService) {

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

      this.categoryStream.next(new Category(1));
    };
  }

  ngOnInit() {
    // init column selection
    this.playerDatasource = new PlayerDataSource(this.tournamentStream, this.federationStream, this.categoryStream, this.searchTermStream, this.playerTypeStream, this.paginator, this.sort, this.playerService, true);

    // listen to datasource connection to trigger initial search
    this.playerDatasource.connectionNotifier.subscribe((connected: boolean) => {
      if (connected) {
        // TRIGGER THE INITIAL SEARCH. We could use any subject for this purpose
        this.federationStream.next(null);
        this.categoryStream.next(null);
      }
    });

    this.categoryService.list().subscribe((categoryList: ListResult<Category>) => {
      this.categoryList = categoryList.list;
      this.selectedCategory = this.categoryList[0];
      this.onSelectionChange();
    });

    this.showFederationSelect = this.authService.hasRole(["ROLE_SUPER_ADMIN", "ROLE_GENERAL_ADMIN"]);

    if (this.showFederationSelect) {
      this.federationService.list().subscribe((federationList: ListResult<Federation>) => {
        this.federationList = federationList.list;
      });
    }
  }

  search(value:string) {
    this.terms = value;
    this.searchTermStream.next(this.terms);
  }

  clearFilterText() {
    this.terms = "";
    this.search(this.terms);
  }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  onFederationChange(newValue: Federation) {
    this.onSelectionChange();
    this.selectedFederation = newValue;
    this.federationStream.next(newValue);
  }

  onCategoryChange(newValue: Category) {
    this.onSelectionChange();
    this.selectedCategory = newValue;
    this.categoryStream.next(newValue);
  }

  onSelectionChange(){

    this.rankingField = "ranking";
    this.pointsField = "points";

    if (this.selectedCategory.id != 1) {
      this.rankingField = this.rankingField.concat("Lm");
      this.pointsField = this.pointsField.concat("Lm");
    }

    if ((this.authService.hasRole(["ROLE_FEDERATION_ADMIN"]) || this.selectedFederation != null)) {
      this.rankingField = this.rankingField.concat("Fed");
      this.pointsField = this.pointsField.concat("Fed");
    }

  }
}
