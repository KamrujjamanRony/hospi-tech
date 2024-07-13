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
  standalone: true,
  imports: [CommonModule, CanvasJSAngularChartsModule, FormsModule, RouterLink],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css',
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
              console.log(response)
              this.commentCode = response.comCode;
              this.adviceCode = response.advCode;
              this.refDoctorCode = response.refCode;
              this.updateChartData();

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
  private updateChartData() {
    // The chart start position
    this.chartOptions = {
      animationEnabled: true,
      height: 300,
      title: {
        text: 'Haemoglobin Electrophoresis',
        fontSize: 20,
      },
      axisY: {
        title: 'Area',
        gridColor: "lightGray",
        maximum: 105,     
        interval: 25,
      },
      axisX: {
        title: 'Time',
        interval: 40,
        viewportMinimum: 0,
        viewportMaximum: 370
      },
      toolTip: {
        shared: true,
      },
      legend: {
        fontSize: 9,
      },
      data: [
        {
          type: 'splineArea',
          indexLabelFontSize: 9,
          name: 'Hb Barts',
          markerSize: 0,
          color: 'rgba(134,180,2,.7)',
          dataPoints: [
            { x: -999999999, y: 0 },
            { x: 0, y: 0 },
            {
              x: 15,
              y: this.mainUI?.hbBarts,
              indexLabel: "Hb Barts",
              indexLabelFontColor: 'black', indexLabelFontWeight: "bolder", indexLabelMaxWidth: 45
            },
            { x: 30, y: 0 },
            { x: 999999999, y: 0 },
          ],
        },
        {
          type: 'splineArea',
          indexLabelFontSize: 9,
          name: 'Hb F',
          markerSize: 0,
          color: 'rgba(34,180,112,.7)',
          dataPoints: [
            { x: -999999999, y: 0 },
            { x: 35, y: 0 },
            {
              x: 50,
              y: this.mainUI?.hbF,
              indexLabel: "Hb F",
              indexLabelFontColor: 'black', indexLabelFontWeight: "bolder", indexLabelMaxWidth: 35
            },
            { x: 65, y: 0 },
            { x: 999999999, y: 0 },
          ],
        },
        {
          type: 'splineArea',
          indexLabelFontSize: 9,
          name: 'Hb J',
          markerSize: 0,
          color: 'rgba(241, 196, 15,.7)',
          dataPoints: [
            { x: -999999999, y: 0 },
            { x: 125, y: 0 },
            {
              x: 140,
              y: this.mainUI?.hbJ,
              indexLabel: "Hb J",
              indexLabelFontColor: 'black', indexLabelFontWeight: "bolder", indexLabelMaxWidth: 35
            },
            { x: 155, y: 0 },
            { x: 999999999, y: 0 },
          ],
        },
        {
          type: 'splineArea',
          indexLabelFontSize: 9,
          name: 'hb A',
          markerSize: 0,
          color: 'rgba(154,18,133,.7)',
          dataPoints: [
            { x: -999999999, y: 0 },
            { x: 155, y: 0 },
            {
              x: 170,
              y: this.mainUI?.hbA,
              indexLabel: "Hb A",
              indexLabelFontColor: 'black',
              indexLabelFontWeight: "bolder", indexLabelMaxWidth: 35
            },
            { x: 185, y: 0 },
            { x: 999999999, y: 0 },
          ],
        },
        {
          type: 'splineArea',
          indexLabelFontSize: 9,
          name: 'hb Lepore',
          markerSize: 0,
          color: 'rgba(54,158,173,.7)',
          dataPoints: [
            { x: -999999999, y: 0 },
            { x: 185, y: 0 },
            {
              x: 200,
              y: this.mainUI?.hbL,
              indexLabel: "Hb L",
              indexLabelFontColor: 'black',
              indexLabelFontWeight: "bolder", indexLabelMaxWidth: 35
            },
            { x: 215, y: 0 },
            { x: 999999999, y: 0 },
          ],
        },
        {
          type: 'splineArea',
          indexLabelFontSize: 9,
          name: 'Hb E',
          markerSize: 0,
          color: 'rgba(22,170,16,.7)',
          dataPoints: [
            { x: -999999999, y: 0 },
            { x: 225, y: 0 },
            {
              x: 240,
              y: this.mainUI?.hbE,
              indexLabel: "Hb E",
              indexLabelFontColor: 'black', indexLabelFontWeight: "bolder", indexLabelMaxWidth: 35
            },
            { x: 255, y: 0 },
            { x: 999999999, y: 0 },
          ],
        },
        {
          type: 'splineArea',
          indexLabelFontSize: 9,
          name: 'Hb A2',
          markerSize: 0,
          color: 'rgba(94,0,226,.7)',
          dataPoints: [
            { x: -999999999, y: 0 },
            { x: 240, y: 0 },
            {
              x: 255,
              y: this.mainUI?.hbA2,
              indexLabel: "Hb A2",
              indexLabelFontColor: 'black', indexLabelFontWeight: "bolder", indexLabelMaxWidth: 35
            },
            { x: 270, y: 0 },
            { x: 999999999, y: 0 },
          ],
        },
        {
          type: 'splineArea',
          indexLabelFontSize: 9,
          name: 'Hb D',
          markerSize: 0,
          color: 'rgba(194,70,66,.7)',
          dataPoints: [
            { x: -999999999, y: 0 },
            { x: 270, y: 0 },
            {
              x: 285,
              y: this.mainUI?.hbD,
              indexLabel: "Hb D",
              indexLabelFontColor: 'black', indexLabelFontWeight: "bolder", indexLabelMaxWidth: 35
            },
            { x: 300, y: 0 },
            { x: 999999999, y: 0 },
          ],
        },
        {
          type: 'splineArea',
          indexLabelFontSize: 9,
          name: 'hb S',
          markerSize: 0,
          color: 'rgba(103, 117, 213,.7)',
          dataPoints: [

            { x: -999999999, y: 0 },
            { x: 315, y: 0 },
            {
              x: 330,
              y: this.mainUI?.hbS,
              indexLabel: "Hb S",
              indexLabelFontColor: 'black', indexLabelFontWeight: "bolder", indexLabelMaxWidth: 35
            },
            { x: 345, y: 0 },
            { x: 999999999, y: 0 },
          ],
        },
        // {
        //   type: 'splineArea',
        //   indexLabelFontSize: 9,
        //   name: 'hb C',
        //   markerSize: 0,
        //   color: 'rgba(103, 117, 213,.7)',
        //   dataPoints: [
        //     { x: -999999999, y: 0 },
        //     { x: 320, y: 0 },
        //     {
        //       x: 330,
        //       y: this.mainUI?.hbC,
        //       indexLabel: "Hb C",
        //       indexLabelFontColor: 'black',  indexLabelFontWeight: "bolder", indexLabelMaxWidth: 35
        //     },
        //     { x: 340, y: 0 },
        //     { x: 999999999, y: 0 },
        //   ],
        // },
        // {
        //   type: 'splineArea',
        //   indexLabelFontSize: 9,
        //   name: 'hb Q',
        //   markerSize: 0,
        //   color: 'rgba(13, 217, 177,.7)',
        //   dataPoints: [
        //     { x: -999999999, y: 0 },
        //     { x: 330, y: 0 },
        //     {
        //       x: 340,
        //       y: this.mainUI?.hbQ,
        //       indexLabel: "HbQ", ${this.mainUI?.hbQ})`,
        //       indexLabelFontColor: 'black',  indexLabelFontWeight: "bolder", indexLabelMaxWidth: 35
        //     },
        //     { x: 350, y: 0 },
        //     { x: 999999999, y: 0 },
        //   ],
        // },
      ],
    };
    // The chart ends
  }

  ngOnInit() {
    this.dataService.getJsonData().subscribe(data => {
      this.jsonData = data.data.find((d: { id: any; }) => d.id == this.companyID);
      console.log(this.jsonData)
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
