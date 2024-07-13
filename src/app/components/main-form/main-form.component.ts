import { CommonModule, DatePipe, Location, NgClass } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  Validation,
  Input,
  initTE,
  Datepicker,
  Select,
  Modal,
  Collapse,
  Toast
} from 'tw-elements';
import { Router } from '@angular/router';
import { Observable, Subscription, catchError, of, switchMap } from 'rxjs';
import { AdviceService } from '../../services/advice.service';
import { DataService } from '../../services/data.service';
import { MainUIService } from '../../services/main-ui.service';
import { DoctorService } from '../../services/doctor.service';
import { SealService } from '../../services/seal.service';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass, ReactiveFormsModule],
  templateUrl: './main-form.component.html',
  styleUrl: './main-form.component.css',
})
export class MainFormComponent implements OnInit, OnDestroy, AfterViewInit {
  dataService = inject(DataService);
  parseFloat(arg0: number) {
    throw new Error('Method not implemented.');
  }
  isError: boolean = false;
  loading: boolean = true;
  modelAdvice: any;
  modelComment: any;
  modelDoctor: any;
  modelMainUI: any = {};
  modelSeal: any;
  editMainUIId!: string | undefined;
  editDoctorId!: string | undefined;
  editCommentId!: string | undefined;
  editAdviceId!: string | undefined;
  editSealId!: string | undefined;
  mainUI: any[] = [];
  searchMainUI: any[] = [];
  asideMainUI: any[] = [];
  mainUI$?: Observable<any[]>;
  originalMainUI: any[] = [];
  doctors$?: Observable<any[]>;
  originalDoctors: any[] = [];
  doctors: any[] = [];
  comments$?: Observable<any[]>;
  originalComments: any[] = [];
  comments: any[] = [];
  comment!: any;
  advices$?: Observable<any[]>;
  originalAdvices: any[] = [];
  advices: any[] = [];
  seals$?: Observable<any[]>;
  seals?: any[];
  Company$?: Observable<any[]>;
  Company: any = '';
  qq: any = '';
  private apiCalled = false;
  isInputFocused: boolean = false;
  isFormValid: boolean = false;
  showSelect$: Observable<boolean> | undefined;
  addMainUISubscription?: Subscription;
  addDoctorSubscription?: Subscription;
  addSealSubscription?: Subscription;
  addCommentSubscription?: Subscription;
  addAdviceSubscription?: Subscription;
  editMainUISubscription?: Subscription;
  editDoctorSubscription?: Subscription;
  editSealSubscription?: Subscription;
  editCommentSubscription?: Subscription;
  editAdviceSubscription?: Subscription;
  deleteDoctorSubscription?: Subscription;
  deleteSealSubscription?: Subscription;
  deleteCommentSubscription?: Subscription;
  deleteAdviceSubscription?: Subscription;
  selectedIndex: number | null = null;
  companyID: any;
  jsonData: any;
  @ViewChild('searchResults') searchResults: ElementRef | undefined;
  constructor(
    private mainUIService: MainUIService,
    private doctorService: DoctorService,
    private sealService: SealService,
    private commentService: CommentService,
    private adviceService: AdviceService,
    private authService: AuthService,
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef,
    private datePipe: DatePipe,
    private location: Location
  ) {
    // Initialize Company
    this.companyID = this.authService.getCompanyID();
    // get All Company
    if (!this.Company$) {
      this.Company$ = authService.getCompanyById(this.companyID);
      this.Company$.subscribe((data) => {
        this.Company = data[0];
      });
    }
    // Initialize modelMainUI properties
    this.resetMainForm();

    // Initialize modelAdvice properties
    this.modelAdvice = {
      companyID: this.companyID,
      code: '',
      advices: '',
    };

    // Initialize modelComment properties
    this.modelComment = {
      companyID: this.companyID,
      code: '',
      comments: '',
    };

    // Initialize modelDoctor properties
    this.modelDoctor = {
      companyID: this.companyID,
      code: '',
      name: '',
    };

    // Initialize modelSeal properties
    this.modelSeal = {
      companyID: this.companyID,
      name: '',
      degree: '',
      position: '0',
    };

    // get All mainUI
    if (!this.mainUI$) {
      this.mainUI$ = mainUIService.getCompanyMainUIs(this.companyID);
      this.mainUI$.subscribe(() => {
        this.loading = false;
      });
    }

    // get All Ref Doctors
    if (!this.doctors$) {
      this.doctors$ = doctorService.getCompanyDoctors(this.companyID);
      this.doctors$.subscribe(() => {
        this.loading = false;
      });
    }

    // get All Comment
    if (!this.comments$) {
      this.comments$ = commentService.getCompanyComment(
        this.companyID
      );
      this.comments$.subscribe((a) => {
        this.loading = false;
      });
    }

    // get All Advice
    if (!this.advices$) {
      this.advices$ = adviceService.getCompanyAdvice(this.companyID);
      this.advices$.subscribe(() => {
        this.loading = false;
      });
    }

    // get All Seals
    if (!this.seals$) {
      this.seals$ = sealService.getCompanySeals(this.companyID);
      this.seals$.subscribe((data) => {
        this.seals = data;
        this.loading = false;
      });
    }
  }
  ngAfterViewInit(): void {
    initTE(
      { Validation, Input, Datepicker, Select, Modal, Collapse, Toast },
      { allowReinits: true }
    );
  }

  ngOnInit() {
    this.dataService.getJsonData().subscribe(data => {
      this.jsonData = data.data.find((d: { id: any; }) => d.id == this.companyID);
      console.log(this.jsonData);
    });

    // disable future date
    const datepickerDisableFuture = document.getElementById(
      'datepicker-disable-future'
    );
    new Datepicker(datepickerDisableFuture, {
      disableFuture: true,
    });

    // Check if mainUI$ is defined before subscribing
    if (this.mainUI$) {
      this.mainUI$.subscribe((mainUI) => {
        if (mainUI) {
          this.originalMainUI = mainUI;
          this.mainUI = mainUI;

          this.filterByDate();
          // console.log(this.originalMainUI.filter(i => this.transformDate(i.date) == this.transformDate(this.modelMainUI.date)));
        }
      });
    }

    // Check if doctors$ is defined before subscribing
    if (this.doctors$) {
      this.doctors$.subscribe((doctors) => {
        if (doctors) {
          this.originalDoctors = doctors;
          this.doctors = doctors;
        }
      });
    }

    // Check if comments$ is defined before subscribing
    if (this.comments$) {
      this.comments$.subscribe((comments) => {
        if (comments) {
          this.originalComments = comments;
          this.comments = comments;
        }
      });
    }

    // Check if advices$ is defined before subscribing
    if (this.advices$) {
      this.advices$.subscribe((advices) => {
        if (advices) {
          this.originalAdvices = advices;
          this.advices = advices;
        }
      });
    }
  }

  //============================= mainUI =============================

  // Set Date format
  transformDate(dateString: string): any {
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  // handle keyboard navigation
  handleKey(event: KeyboardEvent): void {
    if (this.searchResults && this.searchResults.nativeElement) {
      const items =
        this.searchResults.nativeElement.querySelectorAll('.search-item');

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          this.selectedIndex =
            this.selectedIndex !== null
              ? Math.max(0, this.selectedIndex - 1)
              : 0;
          break;

        case 'ArrowDown':
          event.preventDefault();
          this.selectedIndex =
            this.selectedIndex !== null
              ? Math.min(this.searchMainUI.length - 1, this.selectedIndex + 1)
              : 0;
          break;

        case 'Enter':
          event.preventDefault();
          if (this.selectedIndex !== null) {
            const id = this.searchMainUI[this.selectedIndex].id;
            this.onMainUIClick(id);
          }
          break;

        default:
          break;
      }

      // Ensure the selected item is in view and apply the 'selected' class
      if (items && items.length > 0) {
        items.forEach((item: HTMLElement, index: number) => {
          this.renderer.removeClass(item, 'selected');
          if (this.selectedIndex !== null && index === this.selectedIndex) {
            this.renderer.addClass(item, 'selected');
            // console.log('Selected Index:', this.selectedIndex);
            // console.log('Selected Item:', items[this.selectedIndex]);
          }
        });
      }
    }
  }

  // Move the API call outside the search method
  fetchMainUIData() {
    if (!this.apiCalled) {
      this.mainUI$ = this.mainUIService.getCompanyMainUIs(this.companyID);
      this.mainUI$.subscribe((mainUI) => {
        if (mainUI) {
          this.originalMainUI = mainUI;
          this.mainUI = mainUI;
          this.apiCalled = true;
        }
      });
    }
  }

  // Aside mainUI data by date
  filterByDate() {
    this.asideMainUI = this.originalMainUI.filter(
      (a) => this.transformDate(a.date) == this.transformDate(this.modelMainUI.date)
    )
    console.log(this.asideMainUI)
  }

  // Search mainUI data by name

  // Search mainUI data by PID
  onPIDSearch(search: string) {
    if (this.originalMainUI.length > 0 && search.trim() !== '' && search.length > 0) {
      // get latest mainUI data
      this.fetchMainUIData();
      // search conditions
      const searchTermLower = search.toLowerCase();
      this.searchMainUI = this.originalMainUI.filter(
        (a) => a.pid && a.pid.toLowerCase().startsWith(searchTermLower) && this.transformDate(a.date) == this.transformDate(this.modelMainUI.date)
      )
    } else {
      // If the search term is empty, reset the product list
      this.searchMainUI = this.originalMainUI;
      this.apiCalled = false;
    }
  }

  // Fill mainUI form by Id
  onMainUIClick(id: string) {
    this.editMainUISubscription = this.mainUIService.getMainUI(id).subscribe({
      next: (response) => {
        console.log(response)
        this.modelMainUI.companyID = response.companyID;
        this.modelMainUI.date = this.transformDate(response.date);
        this.modelMainUI.pid = response.pid;
        this.modelMainUI.name = response.name;
        this.modelMainUI.age = response.age;
        this.modelMainUI.sex = response.sex;
        this.modelMainUI.refCode = response.refCode;
        this.modelMainUI.comCode = response.comCode;
        this.modelMainUI.advCode = response.advCode;
        this.modelMainUI.printStatus = response.printStatus;
        this.modelMainUI.hb = response.hb;
        this.modelMainUI.hbA = response.hbA;
        this.modelMainUI.hbF = response.hbF;
        this.modelMainUI.hbE = response.hbE;
        this.modelMainUI.hbA2 = response.hbA2;
        this.modelMainUI.hbD = response.hbD;
        this.modelMainUI.hbJ = response.hbJ;
        this.modelMainUI.hbL = response.hbL;
        this.modelMainUI.hbQ = response.hbQ;
        this.modelMainUI.hbS = response.hbS;
        this.modelMainUI.hbC = response.hbC;
        this.modelMainUI.hbBarts = response.hbBarts;
        this.modelMainUI.cabin = response.cabin;
        this.modelMainUI.bed = response.bed;
        this.modelMainUI.sampleID = response.sampleID;
        this.modelMainUI.rDate = response.rDate;
        this.modelMainUI.others1 = response.others1;
        this.modelMainUI.others2 = response.others2;
        this.modelMainUI.others3 = response.others3;
        this.modelMainUI.isMachineData = response.isMachineData;
        this.editMainUIId = id;
        this.searchMainUI = [];
      },
    });
  }

  // Add & Update MainUI Form
  onFormSubmit(): void {
    if (this.modelMainUI.pid && this.modelMainUI.name && this.modelMainUI.age && this.modelMainUI.pid != 'null' && this.modelMainUI.name != 'null' && this.modelMainUI.age != 'null') {
      console.log(this.modelMainUI.others1)
      const addData = new FormData();
      addData.append('CompanyID', this.companyID.toString());
      addData.append('Date', this.transformDate(this.modelMainUI.date));
      addData.append('PID', this.modelMainUI.pid);
      addData.append('Name', this.modelMainUI.name);
      addData.append('Age', this.modelMainUI.age);
      addData.append('Sex', this.modelMainUI.sex);
      addData.append('RefCode', this.modelMainUI.refCode);
      addData.append('ComCode', this.modelMainUI.comCode);
      // addData.append('Comments', this.modelMainUI.comments);
      addData.append('AdvCode', this.modelMainUI.advCode);
      // addData.append('Advices', this.modelMainUI.advices);
      addData.append('PrintStatus', this.modelMainUI.printStatus);
      addData.append('HB', this.modelMainUI.hb);
      addData.append('HbA', this.modelMainUI.hbA);
      addData.append('HbF', this.modelMainUI.hbF);
      addData.append('HbE', this.modelMainUI.hbE);
      addData.append('HbA2', this.modelMainUI.hbA2);
      addData.append('HbD', this.modelMainUI.hbD);
      addData.append('HbJ', this.modelMainUI.hbJ);
      addData.append('HbL', this.modelMainUI.hbL);
      addData.append('HbQ', this.modelMainUI.hbQ);
      addData.append('HbS', this.modelMainUI.hbS);
      addData.append('HbC', this.modelMainUI.hbC);
      addData.append('HbBarts', this.modelMainUI.hbBarts);
      addData.append('Cabin', this.modelMainUI.cabin);
      addData.append('bed', this.modelMainUI.bed);
      addData.append('sampleID', this.modelMainUI.sampleID);
      addData.append('rDate', this.modelMainUI.rDate);
      addData.append('Others1', this.modelMainUI.others1);
      addData.append('Others2', this.modelMainUI.others2);
      addData.append('Others3', this.modelMainUI.others3);
      addData.append('IsMachineData', this.modelMainUI.isMachineData);
      if (this.editMainUIId) {
        const editData = new FormData();
        editData.append('CompanyID', this.companyID.toString());
        editData.append('Date', this.modelMainUI.date);
        editData.append('PID', this.modelMainUI.pid);
        editData.append('Name', this.modelMainUI.name);
        editData.append('Age', this.modelMainUI.age);
        editData.append('Sex', this.modelMainUI.sex);
        editData.append('RefCode', this.modelMainUI.refCode);
        editData.append('ComCode', this.modelMainUI.comCode);
        editData.append('AdvCode', this.modelMainUI.advCode);
        editData.append('PrintStatus', this.modelMainUI.printStatus || false);
        editData.append('HB', this.modelMainUI.hb || '');
        editData.append('HbA', this.modelMainUI.hbA || '');
        editData.append('HbF', this.modelMainUI.hbF || '');
        editData.append('HbE', this.modelMainUI.hbE || '');
        editData.append('HbA2', this.modelMainUI.hbA2 || '');
        editData.append('HbD', this.modelMainUI.hbD || '');
        editData.append('HbJ', this.modelMainUI.hbJ || '');
        editData.append('HbL', this.modelMainUI.hbL || '');
        editData.append('HbQ', this.modelMainUI.hbQ || '');
        editData.append('HbS', this.modelMainUI.hbS || '');
        editData.append('HbC', this.modelMainUI.hbC || '');
        editData.append('HbBarts', this.modelMainUI.hbBarts || '');
        editData.append('Cabin', this.modelMainUI.cabin || '');
        editData.append('bed', this.modelMainUI.bed || '');
        editData.append('sampleID', this.modelMainUI.sampleID || '');
        editData.append('rDate', this.modelMainUI.rDate || '');
        editData.append('Others1', this.modelMainUI.others1 || '');
        editData.append('Others2', this.modelMainUI.others2 || '');
        editData.append('Others3', this.modelMainUI.others3 || '');
        editData.append('IsMachineData', this.modelMainUI.isMachineData || false);
        // Check form Data
        const jsonObject: any = {};
        editData.forEach((value, key) => {
          jsonObject[key] = value;
        });
        console.log(JSON.stringify(jsonObject, null, 2));
        // Update MainUI by Id
        this.editMainUISubscription = this.mainUIService
          .updateMainUI(this.editMainUIId, editData)
          .subscribe({
            next: () => {
              this.mainUI$ = this.mainUIService.getCompanyMainUIs(
                this.companyID
              );
              this.mainUI$.subscribe((mainUI) => {
                if (mainUI) {
                  this.originalMainUI = mainUI;
                  this.mainUI = mainUI;
                }
              });
              this.router
                .navigateByUrl(`result/${this.editMainUIId}`)
                .then(() => {
                  this.editMainUIId = undefined;
                });
            },
            error: (error) => {
              console.log('Error editing Form Data:', error);
            },
          });
      } else {
        this.addMainUISubscription = this.mainUIService
          .addMainUI(addData)
          .subscribe({
            next: (response) => {
              const id: string = (response as any)?.id;
              this.mainUI$ = this.mainUIService.getCompanyMainUIs(
                this.companyID
              );
              this.mainUI$.subscribe((mainUI) => {
                if (mainUI) {
                  this.originalMainUI = mainUI;
                  this.mainUI = mainUI;
                }
              });
              this.resetMainForm();
              this.router.navigateByUrl(`result/${id}`).then(() => { });
            },
            error: (error) => {
              console.log('Error adding Form Data:', error);
            },
          });
      }
    } else {
      this.isFormValid = true;
    }
  }

  // Reset MainUI Form
  resetMainForm(): void {
    this.editMainUIId = undefined;
    this.modelMainUI = {
      companyID: this.companyID,
      date: this.getCurrentDate(),
      pid: '',
      name: '',
      age: '',
      sex: 'N/A',
      refCode: '0',
      refCodeName: '',
      comCode: '0',
      comments: '',
      advCode: '0',
      advices: '',
      printStatus: false,
      hb: '',
      hbA: '',
      hbF: '',
      hbE: '',
      hbA2: '',
      hbD: '',
      hbJ: '',
      hbL: '',
      hbQ: '',
      hbS: '',
      hbC: '',
      hbBarts: '',
      cabin: '',
      bed: '',
      sampleID: '',
      rDate: '',
      others1: '',
      others2: '',
      others3: '',
      isMachineData: false,
    };
  }

  //============================= Refer Doctor =============================

  // Add & Update Doctor
  onRefDoctorFormSubmit(): void {
    if (this.modelDoctor.code != "" && this.modelDoctor.name != "") {
      const formData = new FormData();
      formData.append('CompanyID', this.companyID);
      formData.append('Code', this.modelDoctor.code);
      formData.append('Name', this.modelDoctor.name);
      if (this.editDoctorId) {
        this.editDoctorSubscription = this.doctorService
          .updateDoctor(this.editDoctorId, formData)
          .subscribe({
            next: () => {
              this.doctors$ = this.doctorService.getCompanyDoctors(
                this.companyID
              );
              this.doctors$.subscribe((doctors) => {
                if (doctors) {
                  this.originalDoctors = doctors;
                  this.doctors = doctors;
                }
              });
              this.editDoctorId = undefined;
              this.resetDoctorForm();
            },
          });
      } else {
        this.addDoctorSubscription = this.doctorService
          .addDoctor(formData)
          .subscribe({
            next: () => {
              this.doctors$ = this.doctorService.getCompanyDoctors(
                this.companyID
              );
              this.doctors$.subscribe((doctors) => {
                if (doctors) {
                  this.originalDoctors = doctors;
                  this.doctors = doctors;
                }
              });
              this.resetDoctorForm();
            },
            error: (error) => {
              console.log('Error adding Doctor:', error);
            },
          });
      }
    }
  }

  // Edit Doctor
  onEditDoctor(id: string): void {
    this.editDoctorSubscription = this.doctorService.getDoctor(id).subscribe({
      next: (response) => {
        this.modelDoctor = response;
        this.editDoctorId = id;
      },
    });
  }

  // Delete Doctor
  onDeleteDoctor(id: string): void {
    this.deleteDoctorSubscription = this.doctorService
      .deleteDoctor(id)
      .subscribe({
        next: () => {
          this.doctors$ = this.doctorService.getCompanyDoctors(
            this.companyID
          );
          this.doctors$.subscribe((doctors) => {
            if (doctors) {
              this.originalDoctors = doctors;
              this.doctors = doctors;
            }
          });
        },
      });
  }

  // Reset Doctor Form
  resetDoctorForm(): void {
    this.editDoctorId = undefined;
    this.modelDoctor = {
      companyID: this.companyID,
      code: '',
      name: '',
    };
  }

  //============================= Advice =============================

  // Add & Update Advice
  onAdviceFormSubmit(): void {
    if (this.modelAdvice.code != "" && this.modelAdvice.advices != "") {
      const commData = new FormData();
      commData.append('CompanyID', this.companyID.toString());
      commData.append('Code', this.modelAdvice.code);
      commData.append('Advices', this.modelAdvice.advices);
      if (this.editAdviceId) {
        this.editAdviceSubscription = this.adviceService
          .updateAdvice(this.editAdviceId, commData)
          .subscribe({
            next: () => {
              this.advices$ = this.adviceService.getCompanyAdvice(
                this.companyID
              );
              this.advices$.subscribe((advices) => {
                if (advices) {
                  this.originalAdvices = advices;
                  this.advices = advices;
                }
              });
              this.editAdviceId = undefined;
              this.resetAdviceForm();
            },
          });
      } else {
        this.addAdviceSubscription = this.adviceService
          .addAdvice(commData)
          .subscribe({
            next: () => {
              this.advices$ = this.adviceService.getCompanyAdvice(
                this.companyID
              );
              this.advices$.subscribe((advices) => {
                if (advices) {
                  this.originalAdvices = advices;
                  this.advices = advices;
                }
              });
              this.resetAdviceForm();
            },
            error: (error) => {
              console.log('Error adding Advice:', error);
            },
          });
      }
    }
  }

  // Edit Advice
  onEditAdvice(id: string): void {
    this.editAdviceSubscription = this.adviceService.getAdvice(id).subscribe({
      next: (response) => {
        this.modelAdvice = response;
        this.editAdviceId = id;
      },
    });
  }

  // Delete Advice
  onDeleteAdvice(id: string): void {
    this.deleteAdviceSubscription = this.adviceService
      .deleteAdvice(id)
      .subscribe({
        next: () => {
          this.advices$ = this.adviceService.getCompanyAdvice(
            this.companyID
          );
          this.advices$.subscribe((advices) => {
            if (advices) {
              this.originalAdvices = advices;
              this.advices = advices;
            }
          });
        },
      });
  }

  // Reset Advice Form
  resetAdviceForm(): void {
    this.editAdviceId = undefined;
    this.modelAdvice = {
      companyID: this.companyID,
      code: '',
      advices: '',
    };
  }

  //============================= Comment =============================

  // Add & Update Comment
  onCommentFormSubmit(): void {
    if (this.modelComment.code != "" && this.modelComment.comments != "") {
      const commData = new FormData();
      commData.append('CompanyID', this.companyID.toString());
      commData.append('Code', this.modelComment.code);
      commData.append('Comments', this.modelComment.comments);
      if (this.editCommentId) {
        this.editCommentSubscription = this.commentService
          .updateComment(this.editCommentId, commData)
          .subscribe({
            next: () => {
              this.comments$ = this.commentService.getCompanyComment(
                this.companyID
              );
              this.comments$.subscribe((comments) => {
                if (comments) {
                  this.originalComments = comments;
                  this.comments = comments;
                }
              });
              this.editCommentId = undefined;
              this.resetCommentForm();
            },
          });
      } else {
        this.addCommentSubscription = this.commentService
          .addComment(commData)
          .subscribe({
            next: () => {
              this.comments$ = this.commentService.getCompanyComment(
                this.companyID
              );
              this.comments$.subscribe((comments) => {
                if (comments) {
                  this.originalComments = comments;
                  this.comments = comments;
                }
              });
              this.resetCommentForm();
            },
            error: (error) => {
              console.log('Error adding Comment:', error);
            },
          });
      }
    }
  }

  // Edit Comment
  onEditComment(id: string): void {
    this.editCommentSubscription = this.commentService
      .getComment(id)
      .subscribe({
        next: (response) => {
          this.modelComment = response;
          this.editCommentId = id;
        },
      });
  }

  // Delete Comment
  onDeleteComment(id: string): void {
    this.deleteCommentSubscription = this.commentService
      .deleteComment(id)
      .subscribe({
        next: () => {
          this.comments$ = this.commentService.getCompanyComment(
            this.companyID
          );
          this.comments$.subscribe((comments) => {
            if (comments) {
              this.originalComments = comments;
              this.comments = comments;
            }
          });
        },
      });
  }

  // Reset Comment Form
  resetCommentForm(): void {
    this.editCommentId = undefined;
    this.modelComment = {
      companyID: this.companyID,
      code: '',
      comments: '',
    };
  }

  //============================= Seal =============================

  // Add or Update Seal
  onSealFormSubmit(): void {
    if (this.modelSeal.name != "") {
      const addData = new FormData();
      addData.append('CompanyID', this.companyID.toString());
      addData.append('Name', this.modelSeal.name);
      addData.append('Degree', this.modelSeal.degree);
      addData.append('Position', this.modelSeal.position);

      let updateExistingSeal$: Observable<any | null> = this.editSealId
        ? this.sealService.updateSeal(this.editSealId, addData)
        : of(null as any | null);

      this.seals$ = this.sealService.getCompanySeals(this.companyID);

      // Check if a seal with the same position exists
      this.seals$
        .pipe(
          switchMap((seals) => {
            const foundSeal = seals.find(
              (data) => data.position == this.modelSeal.position
            );

            if (foundSeal) {
              // Update existing seal
              const oldData = new FormData();
              oldData.append('CompanyID', foundSeal.companyID.toString());
              oldData.append('Name', foundSeal.name);
              oldData.append('Degree', foundSeal.degree);
              oldData.append('Position', '0');

              updateExistingSeal$ = this.sealService.updateSeal(
                foundSeal.id,
                oldData
              );
            }
            return updateExistingSeal$;
          }),
          catchError((error) => {
            console.log('Error updating seals:', error);
            return of(null as any | null);
          })
        )
        .subscribe((updateExistingSealResponse) => {
          if (updateExistingSealResponse !== null) {
            // Handle response if needed
            // console.log(
            //   'Update Existing Seal Response:',
            //   updateExistingSealResponse
            // );
          }
          if (this.editSealId) {
            // Update Selected Seal
            this.editSealSubscription = this.sealService
              .updateSeal(this.editSealId, addData)
              .subscribe({
                next: () => {
                  this.seals$ = this.sealService.getCompanySeals(
                    this.companyID
                  );
                  this.resetSealForm();
                  this.editSealId = undefined;
                },
              });
          } else {
            this.addNewSeal(addData);
          }
          updateExistingSealResponse = null;
        });
    }
  }

  // add New Seal
  private addNewSeal(formData: FormData): void {
    this.addSealSubscription = this.sealService.addSeal(formData).subscribe({
      next: () => {
        this.seals$ = this.sealService.getCompanySeals(this.companyID);
        this.resetSealForm();
      },
      error: (error) => {
        console.log('Error adding Seal:', error);
      },
    });
  }

  // Edit Seal
  onEditSeal(id: string): void {
    this.editSealSubscription = this.sealService.getSeal(id).subscribe({
      next: (response) => {
        this.modelSeal = response;
        this.editSealId = id;
      },
    });
  }

  // Reset Seal Form
  resetSealForm(): void {
    this.editSealId = undefined;
    this.modelSeal = {
      companyID: this.companyID,
      name: '',
      degree: '',
      position: '0',
    };
  }

  // Delete Seal
  onDeleteSeal(id: string): void {
    this.deleteSealSubscription = this.sealService.deleteSeal(id).subscribe({
      next: () => {
        this.seals$ = this.sealService.getCompanySeals(this.companyID);
      },
    });
  }

  //============================= Util =============================
  logOut(): void {
    this.authService.deleteCompanyID();
    window.location.reload();
  }

  preventEnterSubmit(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();
    }
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();

      const form = (event.target as HTMLElement).closest('form');
      if (form) {
        const inputs = Array.from(form.querySelectorAll('input, select, textarea'));
        const index = inputs.indexOf(event.target as HTMLInputElement);
        if (index > -1 && index < inputs.length - 1) {
          const nextInput = inputs[index + 1];
          (nextInput as HTMLElement).focus();
        }
      }
    }
  }

  // get the current date in 'yyyy-mm-dd' format
  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // convert in 'yyyy-mm-dd' format
  // transformDate(dateString: string): any {
  //   const dateFormats = [
  //     'DD/MM/YYYY',
  //     'DD-MM-YYYY',
  //     'DD/MM/YY',
  //     'DD-MM-YY',
  //     'YYYY/MM/DD',
  //     'YYYY-MM-DD',
  //     'YY/MM/DD',
  //     'YY-MM-DD',
  //   ];

  //   let date: Date | null = null;

  //   for (const format of dateFormats) {
  //     date = this.tryParseDate(dateString, format);
  //     if (date !== null) {
  //       break;
  //     }
  //   }

  //   if (date !== null) {
  //     return this.datePipe.transform(date, 'yyyy-MM-dd');
  //   } else {
  //     console.log('Unable to parse date:', dateString);
  //     return null; // Or handle the error in another way
  //   }
  // }

  private tryParseDate(dateString: string, format: string): Date | null {
    const parts = dateString?.split(/[\-\/]/);
    const formatParts = format?.split('/');

    const dayIndex = formatParts?.indexOf('DD');
    const monthIndex = formatParts?.indexOf('MM');
    const yearIndex = formatParts?.indexOf('YYYY');

    if (dayIndex === -1 || monthIndex === -1 || yearIndex === -1) {
      // console.log('Invalid date format:', format);
      return null;
    }

    const day = parseInt(parts[dayIndex], 10);
    const month = parseInt(parts[monthIndex], 10) - 1; // Month is zero-based in JavaScript
    const year = parseInt(parts[yearIndex], 10);

    const parsedDate = new Date(year, month, day);

    // Check if the parsed date is valid
    if (
      parsedDate?.getDate() === day &&
      parsedDate?.getMonth() === month &&
      parsedDate?.getFullYear() === year
    ) {
      return parsedDate;
    } else {
      return null;
    }
  }


  // Update the focus event handlers
  onInputFocus() {
    this.isInputFocused = true;
    this.isFormValid = false;
  }

  onOtherFocus() {
    this.isInputFocused = false;
    this.isFormValid = false;
  }

  toastClose() {
    this.isFormValid = false;
  }

  onError(): void {
    this.isError = true;
  }

  //============================= Destroy All Subscription =============================
  ngOnDestroy(): void {
    this.addMainUISubscription?.unsubscribe();
    this.addSealSubscription?.unsubscribe();
    this.addDoctorSubscription?.unsubscribe();
    this.addCommentSubscription?.unsubscribe();
    this.addAdviceSubscription?.unsubscribe();
    this.editMainUISubscription?.unsubscribe();
    this.editSealSubscription?.unsubscribe();
    this.editDoctorSubscription?.unsubscribe();
    this.editCommentSubscription?.unsubscribe();
    this.editAdviceSubscription?.unsubscribe();
    this.deleteSealSubscription?.unsubscribe();
    this.deleteDoctorSubscription?.unsubscribe();
    this.deleteCommentSubscription?.unsubscribe();
    this.deleteAdviceSubscription?.unsubscribe();
  }
}
