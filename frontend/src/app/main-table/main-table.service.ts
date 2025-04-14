import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainTableService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(
    private http: HttpClient
  ) { }

  getFinancialData(period: Date): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/finances?period=${period}`).pipe(
      map(response => {
        response.data = this.fixResponseData(response.data)

        return response
      })
    )
  }

  fixResponseData(data: { [key: string]: string | number | Date }[]) {
    if (data.length === 0) {
      return data
    } else {
      for (let index = 0; index < data.length; index++) {
        if (data[index]["date"]) {
          data[index]["date"] = new Date(data[index]["date"])
        }
      }
      return data
    }
  }

  updateAddItem(itemId: string, field: string, value: boolean | string | Date): Observable<any> {
    if (typeof itemId === "number") {
      return this.http.post<{ field: string, value: boolean | string | Date }>(`${this.apiUrl}/finances/`, {
        itemId,
        field,
        value
      })
    } else {
      return this.http.patch<{ field: string, value: boolean | string | Date }>(`${this.apiUrl}/finances/${itemId}`, {
        field,
        value
      })
    }
  }

  deleteItem(itemId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/finances/${itemId}`)
  }
}
