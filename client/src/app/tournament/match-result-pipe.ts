import { Pipe, PipeTransform } from '@angular/core';
/*
 * used to get the points for each set for each player from the match object
 */
@Pipe({name: 'matchResult'})
export class MatchResultPipe implements PipeTransform {
  transform(result: string, set: number, pos: number): number {

    if (result) {
      let setResultArray = result.split(",");
      let setResult = setResultArray[set];
      if (setResult) {
        let playerPointsArray = setResult.split("-");
        let playerPoints = playerPointsArray[pos];
        if (playerPoints) {
          return Number(playerPoints);
        }
      }
    }

    return 0;
  }
}