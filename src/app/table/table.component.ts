import {Component, OnInit} from '@angular/core';
import {DataService} from "../services/data.service";
import {TableModel} from "../models/table-model";
import 'ag-grid-enterprise';
import 'ag-grid-enterprise/dist/styles/ag-grid.css';
import 'ag-grid-enterprise/dist/styles/ag-theme-alpine.css';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit{

  lvl1Options : string[]
  lvl2Options : string[]

  lvl1OptionSelected: string = 'company'
  lvl2OptionSelected: string

  private gridApi;
  private gridColumnApi;

  columnDefs;
  defaultColDef;
  autoGroupColumnDef;
  pivotRowTotals;
  rowData: Array<TableModel>;

  constructor(private dataService: DataService) {


    this.columnDefs = [

      {
        headerName: 'NAME',
        field: 'name',
        enableRowGroup: true,
      },
      {
        headerName: 'EMAIL',
        field: 'email',
        enableRowGroup: true,
      },
      {
        headerName: 'ADDREss',
        field: 'address',
        enablePivot: true,
        enableRowGroup: true,
      },
      {
        field: 'company',
        enableRowGroup: true,
        enablePivot: true,
      },
      {
        field: 'color',
        enableRowGroup: true,
        enablePivot: true,
      },
      {
        field: 'lang',
        enableRowGroup: true,
        enablePivot: true,
      },
      {
        field: 'country',
        enableRowGroup: true,
        enablePivot: true,
      },
      {
        headerName: 'leads',
        field: 'leads',
        aggFunc: 'sum',
      },
      {
        headerName: 'revenue',
        field: 'revenue',
        aggFunc: 'sum',
      },
    ];
    this.defaultColDef = {
      flex: 1,
      minWidth: 150,
      resizable: true,
    };
    this.pivotRowTotals = 'after';

    this.autoGroupColumnDef = {
      headerName: 'Name',
      minWidth: 200,
      cellRendererParams: {
        suppressCount: true
      }
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridColumnApi.addRowGroupColumn(this.lvl1OptionSelected);

    this.dataService.fetchData(this.lvl1OptionSelected)
      .subscribe(data => {
        this.rowData = data;
      });
  }

  onChangeLvl1(value){
    this.lvl1OptionSelected = value
    this.lvl2OptionSelected = ''
    this.removeGrouping()
    this.fetchNewDate()
  }

  onChangeLvl2(value){
    this.lvl2OptionSelected = value
    this.removeGrouping()
    this.fetchNewDate()
  }

  private fetchNewDate(){
    this.dataService.fetchData(this.lvl1OptionSelected, this.lvl2OptionSelected)
      .subscribe(data => {
        this.rowData = data
        this.gridColumnApi
          .addRowGroupColumns([this.lvl1OptionSelected, this.lvl2OptionSelected]);
      } )
  }

  ngOnInit(): void {
    this.lvl1Options = ['company', 'color']
    this.lvl2Options = ['lang', 'country']
  }


  private removeGrouping() {
    this.gridColumnApi.getRowGroupColumns()
      .map(col => col.colId)
      .forEach(col =>
        this.gridColumnApi.removeRowGroupColumn(col))
  }
}
