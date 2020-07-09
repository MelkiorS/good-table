import {Component, OnInit} from '@angular/core';
import {DataService, ResponseData} from "../services/data.service";
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
      {
        headerName: 'rpl',
        field: 'rpl',
        valueGetter: this.rplGetter.bind(this),
        aggFunc:  this.ratioRplFunc.bind(this),
      },
    ]
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

  private ratioRplFunc(values) {
    let revenueSum = 0;
    let leadsSum = 0;
    values.forEach(function(value) {
      if (value && value.revenue) {
        revenueSum += value.revenue;
      }
      if (value && value.leads) {
        leadsSum += value.leads;
      }
    });
    return this.createValueObject(revenueSum, leadsSum);

  }

  private rplGetter(params) {
    if (!params.node.group) {
      // no need to handle group levels - calculated in the 'ratioAggFunc'
      return this.createValueObject(params.data.revenue, params.data.leads);
    }
  }

  private createValueObject(revenue, leads) {
    return {
      revenue :revenue,
      leads :leads,
      toString: function() {
        return (revenue && leads) ? Math.round(revenue / leads)  : 0;
      }
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridColumnApi.addRowGroupColumn(this.lvl1OptionSelected);

    this.fetchNewDate()
  }

  private fetchNewDate(){
    this.dataService.fetchData(this.lvl1OptionSelected, this.lvl2OptionSelected)
      .subscribe(resp => {
        this.lvl1Options = resp.lvl1Options
        this.lvl2Options = resp.lvl2Options
        this.rowData = resp.data
      } )
  }

  ngOnInit(): void {
    // setInterval(()=>this.fetchNewDate(), 3000)
  }


  onChangeLvl1(value){
    this.lvl1OptionSelected = value
    this.lvl2OptionSelected = null
    this.removeGrouping()
    this.fetchNewDate()
    this.setGrouping()
  }

  onChangeLvl2(value){
    this.lvl2OptionSelected = value
    this.removeGrouping()
    // this.fetchNewDate()
    this.setGrouping()
  }

  private removeGrouping() {
    this.gridColumnApi.getRowGroupColumns()
      .map(col => col.colId)
      .forEach(col =>
        this.gridColumnApi.removeRowGroupColumn(col))
  }

  private setGrouping(){
    this.gridColumnApi
      .addRowGroupColumns([this.lvl1OptionSelected, this.lvl2OptionSelected])
  }
}
