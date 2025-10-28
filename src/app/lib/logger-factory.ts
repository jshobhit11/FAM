/* eslint-disable @typescript-eslint/no-unused-vars */
import { isDevMode } from '@angular/core';
import { DateTime } from 'luxon';

const noop = (...args: any[]): any => undefined;
let maxContextLength = 0;

export class LoggerFactory {
  private static loggerInstances: Map<String, Logger> = new Map();

  public static getLogger(context?: string): Logger {
    /**
     * Getting the class from which this logger was requested
     */
    if (context === undefined) {
      try {
        throw new Error();
      } catch (e: any) {
        let stack = e.stack.split('\n').map(function (line: any) {
          return line.trim();
        });
        let caller: string[] = stack[2].split(' ');
        while (true) {
          let thisOne: string = caller.shift() as string;
          if (['at', 'new'].indexOf(thisOne) !== -1) {
            continue;
          }

          context = thisOne.split('.')[0];
          break;
        }
      }
    }
    /* Got the name of the class */

    if (!this.loggerInstances.has(context)) {
      let logger: Logger = new Logger(context);
      this.loggerInstances.set(context, logger);
    }

    if (context.length > maxContextLength) {
      maxContextLength = context.length;
    }

    return this.loggerInstances.get(context) as Logger;
  }
}

class Logger {
  private profileStartTimes: Map<string, number>;
  constructor(private context: String) {
    this.profileStartTimes = new Map<string, number>();
  }

  public profile(profilerName: string): void {
    //get the time first thing
    let endTime: number = new Date().getTime();

    // check if we have any profiler by this name
    if (!this.profileStartTimes.has(profilerName)) {
      //create a new profiler
      this.profileStartTimes.set(profilerName, new Date().getTime());
    } else {
      //start profiling
      let startTime: number = this.profileStartTimes.get(profilerName) as number;
      this.profileStartTimes.delete(profilerName);
      this.log('Profile', profilerName, ':: duration:', endTime - startTime, 'ms');
    }
  }

  public startOperation(opName?: string): void {
    if (isDevMode()) {
      console.groupCollapsed(opName);
    }
  }

  public endOperation(): void {
    if (isDevMode()) {
      console.groupEnd();
    }
  }

  get log() {
    if (isDevMode()) {
      return console.log.bind(console, this.getPrefix());
    } else {
      return noop;
    }
  }

  get info() {
    if (isDevMode()) {
      return console.info.bind(console, this.getPrefix());
    } else {
      return noop;
    }
  }

  get warn() {
    if (isDevMode()) {
      return console.warn.bind(console, this.getPrefix());
    } else {
      return noop;
    }
  }

  get debug() {
    if (isDevMode()) {
      return console.debug.bind(console, this.getPrefix());
    } else {
      return noop;
    }
  }

  get error() {
    if (isDevMode()) {
      return console.error.bind(console, this.getPrefix());
    } else {
      return noop;
    }
  }

  private getPrefix(...args: any[]): string {
    args = Array.prototype.slice.call(args);

    var prefix = [];
    prefix.push(this.getFormattedTimestamp());
    prefix.push(['[', '-', this.context, '-', ']', ':'].join(' '));

    return prefix.join(' ');
  }

  private getFormattedTimestamp(): String {
    return DateTime.local().toFormat('HH:mm:ss:SSS');
  }
}
