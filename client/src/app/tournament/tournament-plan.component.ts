import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Tournament} from './tournament';
import {TournamentService} from './tournament.service';
import {Observable} from "rxjs/Observable";
import {TournamentGroupService} from "../tournamentGroup/tournamentGroup.service";
import {TournamentGroup} from "../tournamentGroup/tournamentGroup";
import {MdTab} from '@angular/material';
import {ListResult} from "../helpers/list-result.interface";
import {TournamentMatch} from "../tournamentMatch/tournamentMatch";
import {Player} from "../player/player";
import {Subject} from "rxjs/Subject";
import {ToastCommunicationService} from "../shared/toast-communication.service";
import {PlayerService} from "app/player/player.service";
import {DialogsService} from "../shared/dialog/dialogs.service";

@Component({
  selector: 'tournament-plan',
  templateUrl: './tournament-plan.component.html',
  styleUrls: ['./tournament-plan.component.css'],
})
export class TournamentPlanComponent implements OnInit {

  @ViewChildren(MdTab) mdTabList: QueryList<MdTab>;

  tournament = new Tournament();
  setArray = Array.from(new Array(3),(val,index)=>index+1);
  total: Observable<number>;
  tournamentGroups: Observable<TournamentGroup[]>;
  groupsAvailable: boolean;

  tournamentPlayers: Array<Player>;

  selectedTab: number;

  selectedGroup: TournamentGroup;

  threeWayTieIds = new Array();
  firstPlaceThreeWayTie = false;

  initData: Subject<any>;

  constructor(private route: ActivatedRoute,
              private tournamentService: TournamentService,
              private tournamentGroupService: TournamentGroupService,
              private playerService: PlayerService,
              private router: Router,
              private toastCommunicationService: ToastCommunicationService,
              private dialogsService: DialogsService) {}

  ngOnInit() {
    this.groupsAvailable = false;
    this.selectedTab = 0;
    this.initData = new Subject<any>();
    this.route.params.subscribe((params: Params) => {
      if (params.hasOwnProperty('id')) {
        this.tournamentService.get(+params['id']).subscribe((tournament: Tournament) => {
          this.tournament = tournament;
          this.setArray = Array.from(new Array(tournament.bestOf),(val,index)=>index+1);
          if (this.tournament.includeGroupPhase) {
            this._loadGroups();
          } else {
            this._loadPlayers();
          }
        });
      } else {
        this.router.navigate(['/index']);
      }
    });
  }

  private _loadGroups():void {

    console.log("Loading tournament groups");

    this.tournamentGroupService.list(this.tournament).subscribe((results: ListResult<TournamentGroup>) => {
      this.total = Observable.of(results.total);
      this.tournamentGroups = Observable.of(results.list);
      this.groupsAvailable = results.list.length > 0;
      if (this.groupsAvailable) {
        this.selectedGroup = results.list[0];
      }
      console.log("Loaded tournament groups");
    });

  }

  private _loadPlayers():void {

    console.log("Loading tournament players");

    this.playerService.list(this.tournament, null, 0, null, null, this.tournament.category, null, null, null, true).subscribe((results: ListResult<Player>) => {
      this.total = Observable.of(results.total);
      this.tournamentPlayers = results.list;
      console.log("Loaded tournament players");
    });

  }

  confirmGenerateGroups() {
    if (this.tournamentGroups != null) {
      this.tournamentGroups.subscribe((groupsList: TournamentGroup[]) => {
        if (groupsList.length > 0) {
          this.dialogsService.confirm('confirmation.dialog.attention', 'tournament.gameplan.generate.groups.confirm').subscribe(res => {
            if (res) {
              this.generateGroups();
            }
          });
        } else {
          this.generateGroups();
        }
      });
    } else {
      this.generateGroups();
    }
  }

  generateGroups() {
    console.log("Creating tournament groups");
    this.tournamentGroupService.generateGroups(this.tournament.id).subscribe((results: ListResult<TournamentGroup>) => {
      this.total = Observable.of(results.total);
      this.tournamentGroups = Observable.of(results.list);
      this.groupsAvailable = results.list.length > 0;
      if (this.groupsAvailable) {
        this.selectedGroup = results.list[0];
        this.selectedTab = 0;
      }
      this.tournament.bracketInfo = null;
      this.initData.next(JSON.parse(this.tournament.bracketInfo));
      console.log("Created tournament groups");
    }, err => {
      console.log("Error generating groups");
      this.toastCommunicationService.showToast(this.toastCommunicationService.ERROR, 'tournament.gameplan.generate.groups.failure');
    });
  }

  confirmGenerateDraw() {
    if (this.tournament.draw != null) {
      this.dialogsService.confirm('confirmation.dialog.attention', 'tournament.gameplan.generate.draw.confirm').subscribe(res => {
        if (res) {
          this.generateDraw();
        }
      });
    } else {
      this.generateDraw();
    }
  }

  generateDraw() {
    console.log("Generating final bracket draw");
    this.tournamentService.generateDraw(this.tournament.id).subscribe((tournament: Tournament) => {
      this.tournament = tournament;
      this._getFinalBracketPlayers();
      console.log("Generated final bracket draw");
    }, err => {
      console.log("Error generating bracket draw");
      this.toastCommunicationService.showToast(this.toastCommunicationService.ERROR, 'tournament.gameplan.generate.draw.failure');
    });
  }

  saveGroupChanges() {
    this.tournamentGroupService.save(this.selectedGroup).subscribe((tournamentGroup: TournamentGroup) => {
    });
  }

  savePlayersOrder() {
    let orderArray = [];
    for (let i = 0; i < this.tournamentPlayers.length; i++) {
      orderArray.push(String(this.tournamentPlayers[i].id));
    }

    this.tournament.seedOrder = orderArray.join(",");
    this.tournamentService.save(this.tournament).subscribe((tournament: Tournament) => {
      // show success message
      this.toastCommunicationService.showToast(this.toastCommunicationService.SUCCESS, 'tournament.gameplan.bracket.seeds.success');
    }, (res: Response) => {
      // show error message
      this.toastCommunicationService.showToast(this.toastCommunicationService.ERROR, 'tournament.gameplan.bracket.seeds.failure');
    });
  }

  viewContent(event: any) {
    // the selected tab is the final bracket tab
    if (this.mdTabList.last == event.tab) {
      this.selectedGroup = null;
      if (this.tournament.bracketInfo == null) {
        this._getFinalBracketPlayers();
      } else {
        this.initData.next(JSON.parse(this.tournament.bracketInfo));
      }
    } else {
      if (this.tournamentGroups != null) {
        this.tournamentGroups.subscribe((groupsList: TournamentGroup[]) => {
          this.selectedGroup = groupsList[event.index];
        });
      }
    }
  }

  getMatchOrder(groupOf: number) {
    let matchOrder = [[1,3], [1,2], [2,3]];
    switch(groupOf) {
      case 3:
        matchOrder = [[1,3], [1,2], [2,3]];
        break;
      case 4:
        matchOrder = [[1,3], [4,2], [1,2], [3,4], [1,4], [2,3]];
        break;
      case 5:
        matchOrder = [[1,4], [5,3], [1,3], [4,2], [1,2], [4,5], [2,5], [3,4], [1,5], [2,3]];
        break;
    }

    return matchOrder;
  }

  onInputChange(event) {
    let targetIdElements = event.target.id.split("#");
    let tournamentGroup = Number(targetIdElements[0]);
    let matchOrder = Number(targetIdElements[1]);
    let matchIdPattern = tournamentGroup + "#" + matchOrder;
    let matchInputFields = document.querySelectorAll('[id^="'+ matchIdPattern +'"]');

    let midPoint =  matchInputFields.length / 2;
    let pointsString = "";
    let setsP1 = 0;
    let setsP2 = 0;
    let p1Id;
    let p2Id;
    for (let i = 0; i < midPoint; i++) {
      let p1InputField = (<HTMLInputElement>matchInputFields[i]);
      let p2InputField = ((<HTMLInputElement>matchInputFields[i + midPoint]));

      p1Id = Number(p1InputField.id.split("#")[3]);
      p2Id = Number(p2InputField.id.split("#")[3]);

      let p1Value = Number(p1InputField.value);
      let p2Value = Number(p2InputField.value);

      if ((p1Value >= 11 || p2Value >= 11) && Math.abs(p1Value - p2Value) >= 2) {
        // set is finished, increase set count
        if (p1Value > p2Value) {
          setsP1++;
        }

        if (p2Value > p1Value) {
          setsP2++;
        }
      }

      let separator = i == midPoint - 1 ? "" : ",";
      pointsString += p1Value + "-" + p2Value + separator;
    }
    // remove trailing 0-0 sets from string
    let values = pointsString.split(",");
    let finalPointsString = "";
    for (let i = values.length - 1; i >= 0; i--) {
      if (values[i] != "0-0") {
        finalPointsString = values[i] + "," + finalPointsString;
      }
    }

    finalPointsString = finalPointsString.substr(0, finalPointsString.length -1);

    let finalSetsString = null;
    let winner = null;
    let setsNeededToWin = (this.tournament.bestOf + 1) / 2;
    if (setsP1 == setsNeededToWin || setsP2 == setsNeededToWin) {
      finalSetsString = setsP1 + "-" + setsP2;
      winner = new Player();
      if (setsP1 == setsNeededToWin) {
        winner.id = p1Id;
      } else {
        winner.id = p2Id;
      }
    }

    this.tournamentGroups.subscribe((groupList: TournamentGroup[]) => {
      let matches = groupList[tournamentGroup - 1].matches;
      let match = matches[matchOrder];
      if (match != null) {
        match.points = finalPointsString;
        if (finalSetsString) {
          match.sets = finalSetsString;
        }

        match.winner = winner;
        this._updateGroupWinners();
      } else {
        match = new TournamentMatch();
        match.points = finalPointsString;
        match.player1 = new Player();
        match.player1.id = p1Id;
        match.player2 = new Player();
        match.player2.id = p2Id;
        match.matchNumber = this._getMatchNumber(tournamentGroup - 1, matchOrder + 1, groupList);
        match.tournament = this.tournament;
        if (finalSetsString) {
          match.sets = finalSetsString;
        }
        if (winner) {
          match.winner = winner;
          this._updateGroupWinners();
        }
        matches[matchOrder] = match;
      }
    });
  }

  _updateGroupWinners() {
    if (this._allMatchesHaveWinner()) {

      // calculate first by matches won
      let success = this._calculateWinnersByMatches();

      // if three way tie, check sets first
      if (!success) {
        //console.log("three way tie");
        //console.log(this.threeWayTieIds);
        success = this._calculateWinnersBySets();
      }

      // if three way tie persists, calculate using points
      if (!success) {
        //console.log("three way tie remains");
        //console.log(this.threeWayTieIds);
        success = this._calculateWinnersByPoints();
      }

      //console.log("selected group");
      //console.log(this.selectedGroup);

      // if no success at this point, prompt the use for a random result
      if (!success) {
        console.log("IMPOSIBLE TO RESOLVE THREE WAY TIE BY SETS AND POINTS");
      }

    } else {
      this.selectedGroup.winner = null;
      this.selectedGroup.runnerup = null;
    }
  }

  _allMatchesHaveWinner() {
    let winnerCount = 0;
    for (let match of this.selectedGroup.matches) {
      if (match != null && match.winner != null) {
        winnerCount++;
      }
    }

    let matchCount = this.getMatchOrder(this.selectedGroup.players.length).length;

    return winnerCount == matchCount;
  }

  _getFinalBracketPlayers() {
    let finalBracketPlayers = new Map<string, Player>();
    if (this.tournament.includeGroupPhase) {
      this.tournamentGroups.subscribe((groupList: TournamentGroup[]) => {
        for (let group of groupList) {
          if (group.winner != null && group.runnerup != null) {
            finalBracketPlayers.set("1-" + group.number, group.winner);
            finalBracketPlayers.set("2-" + group.number, group.runnerup);
          } else {
            finalBracketPlayers = null;
            break;
          }
        }

        if (finalBracketPlayers != null) {
          this._populateBracket(finalBracketPlayers);
        } else {
          console.log("THERE ARE GROUPS THAT HAVE NO WINNERS");
          this.toastCommunicationService.showToast(this.toastCommunicationService.WARNING, 'tournament.gameplan.missing.winners');
        }
      });
    } else {
      let midPoint = Math.ceil(this.tournamentPlayers.length / 2);
      for (let i = 0; i < this.tournamentPlayers.length; i++) {
        if (i < midPoint) {
          finalBracketPlayers.set("1-" + (i + 1), this.tournamentPlayers[i]);
        } else {
          finalBracketPlayers.set("2-" + (i - midPoint + 1), this.tournamentPlayers[i]);
        }
      }
      this._populateBracket(finalBracketPlayers);
    }

  }

  _populateBracket(bracketPlayersMap) {
    let draw = this.tournament.draw;
    if (draw != null) {
      let drawMembers = draw.split(",");
      let initData = {
        teams : [],
        results : []
      };
      let teamCounter = 0;
      for (let i = 0; i < drawMembers.length; i++) {
        let member = drawMembers[i];
        if (member != "BYE") {
          let playerInfo = bracketPlayersMap.get(member);
          let bracketEntry = null;
          if (playerInfo != null) {
            bracketEntry = {};
            bracketEntry["name"] = playerInfo.firstName + " " + playerInfo.lastName;
            // add flag
            // add club or country info, depending on if it is a federation tournament or regional one
            if (this.tournament.federation != null) {
              bracketEntry["from"] = playerInfo.club;
            }
          }

          if (i % 2 == 0) {
            let bracketPair = [];
            bracketPair.push(bracketEntry);
            initData.teams.push(bracketPair);
          } else {
            initData.teams[teamCounter].push(bracketEntry);
            teamCounter++;
          }
        } else {
          if (i % 2 == 0) {
            let bracketPair = [];
            bracketPair.push(null);
            initData.teams.push(bracketPair);
          } else {
            initData.teams[teamCounter].push(null);
            teamCounter++;
          }
        }

      }
      this.initData.next(initData);
    } else {
      console.log("THE TOURNAMENT DOES NOT HAVE A DRAW");
      this.toastCommunicationService.showToast(this.toastCommunicationService.WARNING, 'tournament.gameplan.missing.draw');
    }
  }

  _calculateWinnersByMatches() {
    let playerMatches = new Map<number, number>();

    for (let i = 0; i < this.selectedGroup.matches.length; i++) {
      let match = this.selectedGroup.matches[i];

      let winner = match.winner;

      let playerWins = playerMatches.get(winner.id);
      if (playerWins != null) {
        playerWins++;
      } else {
        playerWins = 1;
      }
      playerMatches.set(winner.id, playerWins);
    }

    let mapKeys = Array.from(playerMatches.keys()).sort(function(a, b) {
      return playerMatches.get(Number(b)) - playerMatches.get(Number(a));
    });

    let groupSize = this.selectedGroup.players.length;
    switch(groupSize) {
      case 3:
        if (playerMatches.get(mapKeys[0]) > playerMatches.get(mapKeys[1])) {
          this.selectedGroup.winner = this._getPlayerById(mapKeys[0]);
          this.selectedGroup.runnerup = this._getPlayerById(mapKeys[1]);
          return true;
        } else {
          // three-way tie for first place
          this.threeWayTieIds = new Array();
          for (let i = 0; i < 3; i++) {
            this.threeWayTieIds.push(mapKeys[i]);
          }
          this.firstPlaceThreeWayTie = true;
          this.selectedGroup.winner = null;
          this.selectedGroup.runnerup = null;
          return false;
        }
      case 4:
      case 5:
        if (playerMatches.get(mapKeys[0]) > playerMatches.get(mapKeys[1])) {
          // this is either a clear winners group or a three-way tie for runnerup
          if (playerMatches.size == groupSize - 1) {
            // clear winners
            this.selectedGroup.winner = this._getPlayerById(mapKeys[0]);
            this.selectedGroup.runnerup = this._getPlayerById(mapKeys[1]);
            return true;
          } else {
            // three way tie for runnerup
            this.threeWayTieIds = new Array();
            for (let i = 0; i < 3; i++) {
              this.threeWayTieIds.push(mapKeys[i + 1]);
            }
            this.firstPlaceThreeWayTie = false;
            this.selectedGroup.winner = this._getPlayerById(mapKeys[0]);
            this.selectedGroup.runnerup = null;
            return false;
          }
        } else {
          // three-way tie for first place
          this.threeWayTieIds = new Array();
          for (let i = 0; i < 3; i++) {
            this.threeWayTieIds.push(mapKeys[i]);
          }
          this.firstPlaceThreeWayTie = true;
          this.selectedGroup.winner = null;
          this.selectedGroup.runnerup = null;
          return false;
        }
    }

  }

  _calculateWinnersBySets() {
    let playerSets = new Map<number, any>();

    for (let i = 0; i < this.selectedGroup.matches.length; i++) {
      let match = this.selectedGroup.matches[i];

      // process match only if the players are in the three-way tie array
      if (this._playerInTie(match.player1.id) && this._playerInTie(match.player2.id)) {
        let setsArray = match.sets.split("-");

        let p1SetsWon = Number(setsArray[0]);
        let p2SetsWon = Number(setsArray[1]);
        let p1SetsLost = Number(setsArray[1]);
        let p2SetsLost = Number(setsArray[0]);

        let player1Info = playerSets.get(match.player1.id);
        if (player1Info != null) {
          player1Info.won += p1SetsWon;
          player1Info.lost += p1SetsLost;
          player1Info.avg = player1Info.won / player1Info.lost;
        } else {
          player1Info = {};
          player1Info.won = p1SetsWon;
          player1Info.lost = p1SetsLost;
          player1Info.avg = player1Info.won / player1Info.lost;
          playerSets.set(match.player1.id, player1Info);
        }

        let player2Info = playerSets.get(match.player2.id)
        if (player2Info != null) {
          player2Info.won += p2SetsWon;
          player2Info.lost += p2SetsLost;
          player2Info.avg = player2Info.won / player2Info.lost;
        } else {
          player2Info = {};
          player2Info.won = p2SetsWon;
          player2Info.lost = p2SetsLost;
          player2Info.avg = player2Info.won / player2Info.lost;
          playerSets.set(match.player2.id, player2Info);
        }
      }
    }

    let mapKeys = Array.from(playerSets.keys()).sort(function(a, b) {
      return playerSets.get(Number(b)).avg - playerSets.get(Number(a)).avg;
    });

    if (playerSets.get(mapKeys[0]).avg > playerSets.get(mapKeys[1]).avg) {
      if (this.firstPlaceThreeWayTie) {
        this.selectedGroup.winner = this._getPlayerById(mapKeys[0]);
        this.selectedGroup.runnerup = this._getPlayerById(mapKeys[1]);
      } else {
        // we already have a winner, we only need a runner up
        this.selectedGroup.runnerup = this._getPlayerById(mapKeys[0]);
      }
      return true;
    } else {
      // three-way tie remains
      return false;
    }
  }

  _calculateWinnersByPoints() {
    let playerPoints = new Map<number, any>();

    for (let i = 0; i < this.selectedGroup.matches.length; i++) {
      let match = this.selectedGroup.matches[i];

      // process match only if the players are in the three-way tie array
      if (this._playerInTie(match.player1.id) && this._playerInTie(match.player2.id)) {
        let pointsArray = match.points.split(",");

        let p1PointsWon = 0;
        let p2PointsWon = 0;
        let p1PointsLost = 0;
        let p2PointsLost = 0;
        for (let j = 0; j < pointsArray.length; j++) {
          let setPoints = pointsArray[j].split("-");
          p1PointsWon += Number(setPoints[0]);
          p2PointsWon += Number(setPoints[1]);
          p1PointsLost += Number(setPoints[1]);
          p2PointsLost += Number(setPoints[0]);
        }

        let player1Info = playerPoints.get(match.player1.id);
        if (player1Info != null) {
          player1Info.won += p1PointsWon;
          player1Info.lost += p1PointsLost;
          player1Info.avg = player1Info.won / player1Info.lost;
        } else {
          player1Info = {};
          player1Info.won = p1PointsWon;
          player1Info.lost = p1PointsLost;
          player1Info.avg = player1Info.won / player1Info.lost;
          playerPoints.set(match.player1.id, player1Info);
        }

        let player2Info = playerPoints.get(match.player2.id)
        if (player2Info != null) {
          player2Info.won += p2PointsWon;
          player2Info.lost += p2PointsLost;
          player2Info.avg = player2Info.won / player2Info.lost;
        } else {
          player2Info = {};
          player2Info.won = p2PointsWon;
          player2Info.lost = p2PointsLost;
          player2Info.avg = player2Info.won / player2Info.lost;
          playerPoints.set(match.player2.id, player2Info);
        }
      }
    }

    let mapKeys = Array.from(playerPoints.keys()).sort(function(a, b) {
      return playerPoints.get(Number(b)).avg - playerPoints.get(Number(a)).avg;
    });

    if (playerPoints.get(mapKeys[0]).avg > playerPoints.get(mapKeys[1]).avg) {
      if (this.firstPlaceThreeWayTie) {
        this.selectedGroup.winner = this._getPlayerById(mapKeys[0]);
        this.selectedGroup.runnerup = this._getPlayerById(mapKeys[1]);
      } else {
        // we already have a winner, we only need a runner up
        this.selectedGroup.runnerup = this._getPlayerById(mapKeys[0]);
      }
      return true;
    } else {
      // three-way tie remains
      return false;
    }
  }

  _getPlayerById(playerId) {
    for (let player of this.selectedGroup.players) {
      if (player.id == playerId) {
        return player;
      }
    }
  }

  _playerInTie(playerId) {
    for (let i = 0; i < this.threeWayTieIds.length; i++) {
      if (playerId == this.threeWayTieIds[i]) {
        return true;
      }
    }
    return false;
  }

  _getMatchNumber(tournamentGroupNumber, matchOrder, groupList) {
    let matchNumber = 0;
    for (let i = 0; i < groupList.length; i++) {
      if (i < tournamentGroupNumber) {
        matchNumber += this.getMatchOrder(groupList[i].players.length).length;
      } else {
        if (i == tournamentGroupNumber) {
          matchNumber += matchOrder;
        } else {
          break;
        }
      }

    }
    return matchNumber;
  }

  onNotifyBracketError(event) {
    this.toastCommunicationService.showToast(this.toastCommunicationService.ERROR, 'tournament.gameplan.bracket.update.failure');
  }
}
