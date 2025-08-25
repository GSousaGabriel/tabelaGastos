import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Expenses } from './types/payloadExpense';

@Injectable({
  providedIn: 'root'
})
export class MainTableService {
  private apiUrl = 'http://localhost:32790/api';

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

  saveItems(data: Expenses[]): Observable<Expenses[]> {
    const additionalLine = data.pop()
    if (additionalLine && additionalLine.value > 0) {
      data.push(additionalLine)
    }
    const newItems = data.filter(item => typeof item._id === 'number' || item._id === '')
    return this.http.post<Expenses[]>(`${this.apiUrl}/finances/`, newItems)
  }

  updateItem(itemId: string, field: string, value: boolean | string | Date): Observable<any> {
    return this.http.patch<{ field: string, value: boolean | string | Date }>(`${this.apiUrl}/finances/${itemId}`, {
      field,
      value
    })
  }

  deleteItem(itemId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/finances/${itemId}`)
  }
}
