import { environment } from 'src/environments/environment';
import { APIUrl, RequestMethod } from './types';

const APIBasePoint = environment.baseURL;
const GISBasePoint = environment.gisApiUrl;

export class ApiEndpoint {
  private urlAsString: string = '';
  private url: APIUrl;

  constructor(
    private method: RequestMethod,
    private relativeUrl: APIUrl,
    private pathParams: Map<String, String> = new Map(),
    private isGIS: boolean = false // New flag for GIS
  ) {
    // Use different base URL if it's a GIS API
    this.urlAsString = (isGIS ? GISBasePoint : APIBasePoint) + relativeUrl.toString();
    this.url = relativeUrl;

    this.pathParams.forEach((value, key) => {
      this.urlAsString = this.urlAsString.replace(`{${key}}`, value.toString());
    });
  }

  public addQueryParams(queryParams: Record<string, string>): void {
    const keys = Object.keys(queryParams);
    if (!keys.length) {
      return;
    }

    const qp = keys
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`
      )
      .join('&');
    this.urlAsString += `?${qp}`;
  }

  public getMethod(): RequestMethod {
    return this.method;
  }

  public urlString(): string {
    return this.urlAsString;
  }

  public getUrl(): APIUrl {
    return this.url;
  }
}
