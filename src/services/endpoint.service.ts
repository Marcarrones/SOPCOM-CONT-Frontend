import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, ReplaySubject, tap, throwError } from "rxjs";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
    providedIn: 'root'
})
export class EndpointService {

    static LOGGING = true;

    static SERVER_URL = "http://localhost";
    //static SERVER_URL = "http://gessi3.essi.upc.edu";
    static SERVER_PORT = ":1036";
    static REP_PORT = ":1037";
    static ENTRY_FILE = "index.php"
     
    static URL = EndpointService.SERVER_URL + EndpointService.SERVER_PORT + "/" + EndpointService.ENTRY_FILE;
    static GET_URL(endpoint:string): string { return EndpointService.URL + "/" + endpoint; }
    constructor(
        public http: HttpClient
    ) { }
    
    public get<T>(endpoint: string): Observable<T | undefined | never> {
        return this.http.get<T>(EndpointService.GET_URL(endpoint))
                .pipe(catchError(this.handleError))
                .pipe(tap<T>(data => { if (EndpointService.LOGGING) console.log("GET: ", EndpointService.GET_URL(endpoint), data); }));
    }

    public post(endpoint: string, body: any) : Observable<any | undefined | never> {
        let postSubject = new ReplaySubject<any | undefined | never>(1);
        this.http.post(EndpointService.GET_URL(endpoint), body)
            .pipe(catchError(this.handleError))
            .pipe(tap(data => { if (EndpointService.LOGGING) console.log("POST: ", EndpointService.GET_URL(endpoint), data); }))
            .subscribe(data => {
                postSubject.next(data); // triggers post
                postSubject.complete(); // avoids multiple post calls from future subscribers
            }
        );
        return postSubject;
    }

    public put<T>(endpoint: string, body: any) : Observable<T | undefined | never> {
        let putSubject = new ReplaySubject<T | undefined | never>(1);
        this.http.put<T>(EndpointService.GET_URL(endpoint), body)
            .pipe(catchError(this.handleError))
            .pipe(tap(data => { if (EndpointService.LOGGING) console.log("PUT: ", EndpointService.GET_URL(endpoint), data); }))
            .subscribe(data => {
                putSubject.next(data); // triggers put
                putSubject.complete(); // avoids multiple put calls from future subscribers
            }
        );
        return putSubject;
    }

    public delete(endpoint: string) : Observable<any  | undefined | never> {
        let deleteSubject = new ReplaySubject<any | undefined | never>(1);
        this.http.delete(EndpointService.GET_URL(endpoint))
            .pipe(catchError(this.handleError))
            .pipe(tap(data => { if (EndpointService.LOGGING) console.log("DELETE: ", EndpointService.GET_URL(endpoint), data); }))
            .subscribe(data => {
                deleteSubject.next(data); // triggers delete
                deleteSubject.complete(); // avoids multiple delete calls from future subscribers
            }
        );
        return deleteSubject;
    }

    private handleError(error: HttpErrorResponse) {
        if (error instanceof HttpErrorResponse) { // Server error
            return throwError(() => `[${error.status} - ${error.statusText}] ${error.message}` );
        } else {
            console.error('[CLIENT]', error); // Non-http error - Client error
        }
        // Return an observable with a user-facing error message.
        return throwError(() => error);
    }

}