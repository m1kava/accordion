import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface AccordionResponseModel {
  code: number;
  data: Array<AccordionModel>;
  description: string;
}
interface AccordionModel {
  categoryFlag: string;
  categoryId: number;
  categoryName: string;
  eventsCount: number;
  level: number;
  parentCategory: number;
  parentName: string;
  remoteId: number;
  sortOrder: number;
  sportId: number;
  sportName: string;
  treatAsSport: number;
}

interface AccordionDataModel {
  name: string;
  eventsCount: number;
  sortOrder: number;
  children: Array<{
    name: string;
    eventsCount: number;
    sortOrder: number;
    children: Array<{
      name: string;
      sortOrder: number;
    }>
  }>
}

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements OnInit {
  private url: string ='https://www.lionsbet.com/rest/market/categories';

  public accordionData: AccordionDataModel[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get(this.url).subscribe((res: AccordionResponseModel) => {
      this.accordionData = this.sortData(res.data);
    });
  }

  sortData(data: AccordionModel[]): AccordionDataModel[] {
    return data
      .filter((category: AccordionModel) => category.level === 1)
      .map((category: AccordionModel) => {
        return {
          name: category.categoryName,
          eventsCount: category.eventsCount,
          sortOrder: category.sortOrder,
          children: data
            .filter((country: AccordionModel) => country.level === 2 && country.parentCategory === category.categoryId)
            .map((country: AccordionModel) => {
              return {
                name: country.categoryName,
                eventsCount: country.eventsCount,
                sortOrder: country.sortOrder,
                children: data
                  .filter((championship: AccordionModel) => championship.level === 3 && championship.parentCategory === country.categoryId)
                  .map((championship: AccordionModel) => {
                    return {
                      name: championship.categoryName,
                      sortOrder: championship.sortOrder
                    };
                  })
                  .sort((a, b) => a.sortOrder - b.sortOrder)
              };
            })
            .sort((a, b) => a.sortOrder - b.sortOrder)
        };
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }
}
