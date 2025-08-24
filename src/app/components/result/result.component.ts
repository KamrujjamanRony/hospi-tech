import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { FormsModule } from '@angular/forms';
import { Input, initTE, Select, Collapse } from 'tw-elements';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AdviceService } from '../../services/advice.service';
import { DataService } from '../../services/data.service';
import { DoctorService } from '../../services/doctor.service';
import { MarginService } from '../../services/margin.service';
import { SealService } from '../../services/seal.service';
import { CommentService } from '../../services/comment.service';
import { MainUIService } from '../../services/main-ui.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-result',
  imports: [CommonModule, CanvasJSAngularChartsModule, FormsModule, RouterLink],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent implements OnInit, OnDestroy {
  dataService = inject(DataService);
  id: string | null = null;
  mainUI?: any;
  margin$?: Observable<any | undefined>;
  margin?: string;
  marginId?: string;
  seals$?: Observable<any[]>;
  seals?: any[];
  comments$?: Observable<any[]>;
  comment!: any;
  commentCode!: any;
  advices$?: Observable<any[]>;
  advice!: any;
  adviceCode!: any;
  refDoctor$?: Observable<any[]>;
  refDoctor!: any;
  refDoctorCode!: any;
  leftSeals?: any;
  middleSeals?: any;
  rightSeals?: any;
  paramsSubscription?: Subscription;
  addMarginSubscription?: Subscription;
  editMarginSubscription?: Subscription;
  chartOptions: any;
  chartOptions7: any;
  date: any;
  currentDate?: string;
  companyID: any;
  Company$?: Observable<any[]>;
  Company: any = '';
  loading: boolean = false;
  jsonData: any;
  marginTop: any;

  constructor(
    private doctorService: DoctorService,
    private marginService: MarginService,
    private sealService: SealService,
    private commentService: CommentService,
    private adviceService: AdviceService,
    private mainUIService: MainUIService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.companyID = this.authService.getCompanyID();

    // get All Company
    if (!this.Company$) {
      this.Company$ = authService.getCompanyById(this.companyID);
      this.Company$.subscribe((data) => {
        this.Company = data[0];
      });
    }
    this.currentDate = this.getCurrentDate();
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');
        if (this.id) {
          this.mainUIService.getMainUI(this.id).subscribe({
            next: (response) => {
              this.mainUI = response;
              let hbA;
              if (this.mainUI?.hbA && this.mainUI?.hbA > 30) {
                hbA = {
                  type: 'splineArea',
                  indexLabelFontSize: 9,
                  name: 'Hb A',
                  markerSize: 0,
                  color: 'rgba(217, 143, 167,.9)',
                  lineColor: 'red',
                  lineThickness: 1,
                  dataPoints: [
                    { x: 130, y: 0 },
                    { x: 147, y: 2.1 },
                    { x: 147.95, y: 2.4 },
                    { x: 148, y: 2.5 },
                    {
                      x: 150,
                      y: this.mainUI?.hbA,
                      indexLabel: "Hb A",
                      indexLabelFontColor: 'black', indexLabelFontWeight: "bolder", indexLabelMaxWidth: 45
                    },
                    { x: 160, y: 6.5 },
                    { x: 160.1, y: 6.3 },
                    { x: 161, y: 5.5 },
                    { x: 162, y: 4.0 },
                    { x: 163, y: 3.3 },
                    { x: 164, y: 2.8 },
                    { x: 165, y: 2.4 },
                    { x: 185, y: 0 },
                  ],
                }
              } else {
                hbA = {
                  type: 'splineArea',
                  indexLabelFontSize: 9,
                  name: 'Hb A',
                  markerSize: 0,
                  color: 'rgba(217, 143, 167,.9)',
                  lineColor: 'red',
                  lineThickness: 1,
                  dataPoints: [
                    { x: -999999999, y: 0 },
                    { x: 140, y: 0 },
                    {
                      x: 150,
                      y: this.mainUI?.hbA,
                      indexLabel: "Hb A",
                      indexLabelFontColor: 'black', indexLabelFontWeight: "bolder", indexLabelMaxWidth: 45
                    },
                    { x: 160, y: 0 },
                    { x: 999999999, y: 0 },
                  ],
                }
              }
              // console.log(response)
              this.commentCode = response.comCode;
              this.adviceCode = response.advCode;
              this.refDoctorCode = response.refCode;
              this.updateChartData(hbA);

              // ----------get Ref Doctor--------------
              if (!this.refDoctor$) {
                this.refDoctor$ = doctorService.getCompanyDoctors(this.companyID);
                this.refDoctor$.subscribe((data) => {
                  this.refDoctor = data.find((a) => a.code == this.refDoctorCode);
                });
              }
              // ----------get target Comment--------------
              if (!this.comments$) {
                this.comments$ = commentService.getCompanyComment(this.companyID);
                this.comments$.subscribe((data) => {
                  this.comment = data.find((a) => a.code == this.commentCode);
                });
              }
              // --------get target Advice-----------
              if (!this.advices$) {
                this.advices$ = adviceService.getCompanyAdvice(this.companyID);
                this.advices$.subscribe((advices) => {
                  this.advice = advices.find((a) => a.code == this.adviceCode);
                });
              }

              // get margin
              if (!this.margin$) {
                this.margin$ = marginService.getCompanyMargin(this.companyID);
                this.margin$.subscribe((data) => {
                  if (data) {
                    this.margin = data.code;
                    this.marginId = data.id;
                    this.loading = true;
                  }
                });
              }
            },
          });
        }
      },
    });

    // get All Seals
    if (!this.seals$) {
      this.seals$ = sealService.getCompanySeals(this.companyID);
      this.seals$.subscribe((seals) => {
        this.leftSeals = seals.find((a) => a.position == '1');
        this.middleSeals = seals.find((a) => a.position == '2');
        this.rightSeals = seals.find((a) => a.position == '3');
        this.seals = seals;
      });
    }

  }

  // Set Date format
  transformDate(dateString: any): any {
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'dd-MM-yyyy');
  }

  // Set Current Date format
  getCurrentDate(): any {
    const currentDate = new Date();
    return this.datePipe.transform(currentDate, 'dd-MM-yyyy');
  }

  // Set Chart Data
  private updateChartData(hbA: any) {
    // The chart start position
    this.chartOptions = {
      animationEnabled: true,
      height: 350,
      // title: {
      //   text: 'Haemoglobin Electrophoresis',
      //   fontSize: 20,
      // },
      axisY: {
        // title: 'Area',
        labelFontSize: 10,
        gridColor: "lightGray",
        maximum: 104,
        interval: 5,
      },
      axisX: {
        title: ' .',
        labelFontSize: 10,
        interval: 20,
        viewportMinimum: 0,
        viewportMaximum: 310
      },
      toolTip: {
        shared: true,
      },
      legend: {
        fontSize: 7,
      },
      data: [
        {
          type: 'splineArea',
          indexLabelFontSize: 9,
          name: 'Hb Barts',
          markerSize: 0,
          color: 'rgba(134,180,2,.9)',
          lineColor: 'red',
          lineThickness: 1,
          dataPoints: [
            { x: -999999999, y: 0 },
            { x: 25, y: 0 },
            {
              x: 30,
              y: this.mainUI?.hbBarts,
              indexLabel: "Hb Barts",
              indexLabelFontColor: 'black', indexLabelFontWeight: "bolder", indexLabelMaxWidth: 45
            },
            { x: 35, y: 0 },
            { x: 999999999, y: 0 },
          ],
        },
        hbA,
        {
          type: 'splineArea',
          indexLabelFontSize: 9,
          name: 'Hb F',
          markerSize: 0,
          color: 'rgba(255, 165, 0,.9)',
          lineColor: 'red',
          lineThickness: 1,
          dataPoints: [
            { x: -999999999, y: 0 },
            { x: 185, y: 0 },
            {
              x: 190,
              y: this.mainUI?.hbF,
              indexLabel: "Hb F",
              indexLabelFontColor: 'black', indexLabelFontWeight: "bolder", indexLabelMaxWidth: 35
            },
            { x: 195, y: 0 },
            { x: 999999999, y: 0 },
          ],
        },
        {
          type: 'splineArea',
          indexLabelFontSize: 9,
          name: 'Hb D',
          markerSize: 0,
          color: 'rgba(22,170,16,.9)',
          lineColor: 'red',
          lineThickness: 1,
          dataPoints: [
            { x: -999999999, y: 0 },
            { x: 205, y: 0 },
            {
              x: 210,
              y: this.mainUI?.hbD,
              indexLabel: "Hb D",
              indexLabelFontColor: 'black', indexLabelFontWeight: "bolder", indexLabelMaxWidth: 35
            },
            { x: 215, y: 0 },
            { x: 999999999, y: 0 },
          ],
        },
        {
          type: 'splineArea',
          indexLabelFontSize: 9,
          name: 'hb S',
          markerSize: 0,
          color: 'rgba(154,18,133,.9)',
          lineColor: 'red',
          lineThickness: 1,
          dataPoints: [
            { x: -999999999, y: 0 },
            { x: 255, y: 0 },
            {
              x: 260,
              y: this.mainUI?.hbS,
              indexLabel: "Hb S",
              indexLabelFontColor: 'black',
              indexLabelFontWeight: "bolder", indexLabelMaxWidth: 35
            },
            { x: 265, y: 0 },
            { x: 999999999, y: 0 },
          ],
        },
        {
          type: 'splineArea',
          indexLabelFontSize: 9,
          name: 'Hb E',
          markerSize: 0,
          color: 'rgba(128,128,128,.9)',
          lineColor: 'red',
          lineThickness: 1,
          dataPoints: [
            { x: -999999999, y: 0 },
            { x: 225, y: 0 },
            {
              x: 230,
              y: this.mainUI?.hbE,
              indexLabel: "Hb E",
              indexLabelFontColor: 'black', indexLabelFontWeight: "bolder", indexLabelMaxWidth: 35
            },
            { x: 235, y: 0 },
            { x: 999999999, y: 0 },
          ],
        },
        {
          type: 'splineArea',
          indexLabelFontSize: 9,
          name: 'Hb A2',
          markerSize: 0,
          color: 'rgba(255,255,0,.9)',
          lineColor: 'red',
          lineThickness: 1,
          dataPoints: [
            { x: -999999999, y: 0 },
            { x: 238, y: 0 },
            {
              x: 243,
              y: this.mainUI?.hbA2,
              indexLabel: "Hb A2",
              indexLabelFontColor: 'black', indexLabelFontWeight: "bolder", indexLabelMaxWidth: 35
            },
            { x: 248, y: 0 },
            { x: 999999999, y: 0 },
          ],
        },
        {
          type: 'splineArea',
          indexLabelFontSize: 9,
          name: 'hb C',
          markerSize: 0,
          color: 'rgba(103, 117, 213,.9)',
          lineColor: 'red',
          lineThickness: 1,
          dataPoints: [
            { x: -999999999, y: 0 },
            { x: 270, y: 0 },
            {
              x: 275,
              y: this.mainUI?.hbC,
              indexLabel: "Hb C",
              indexLabelFontColor: 'black', indexLabelFontWeight: "bolder", indexLabelMaxWidth: 35
            },
            { x: 280, y: 0 },
            { x: 999999999, y: 0 },
          ],
        },
      ],
    };
    // The chart ends
  }

  ngOnInit() {
    this.dataService.getJsonData().subscribe(data => {
      this.jsonData = data.data.find((d: { id: any; }) => d.id == this.companyID);
      // console.log(this.jsonData)
    });
    initTE({ Input, Select, Collapse }, { allowReinits: true });
  }

  // update Margin by id
  onMarginChange(id: any) {
    const marginData = new FormData();
    marginData.append('CompanyID', this.companyID.toString() || '');
    marginData.append('Code', this.margin || '');
    if (id) {
      this.editMarginSubscription = this.marginService
        .updateMargin(id, marginData)
        .subscribe({
          next: () => { },
        });
    } else {
      this.addMarginSubscription = this.marginService
        .addMargin(marginData)
        .subscribe({
          next: () => { },
        });
    }
  }

  //============================= Util =============================
  logOut(): void {
    this.authService.deleteCompanyID();
    window.location.reload();
  }

  // Function to print the page
  isPrinting: boolean = false;
  printPage() {
    this.isPrinting = true;
    setTimeout(() => {
      window.print();
      // Reset the printing state after printing is complete
      setTimeout(() => {
        this.isPrinting = false;
      }, 1000); // Adjust the delay as needed
    }, 100); // Adjust the delay as needed
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.addMarginSubscription?.unsubscribe();
    this.editMarginSubscription?.unsubscribe();
  }
}
