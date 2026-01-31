import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuFacadeService, MenuResponseDTO } from '@data/menu';
import { IonicModule } from '@ionic/angular';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppUtilsService } from '@shared/utils/app-utils.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HeaderComponent } from '../../layouts/header/header.component';

// PrimeNG imports
import { addIcons } from 'ionicons';
import { cafe, fastFood, restaurant, searchOutline } from 'ionicons/icons';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { WorkflowFacade } from '@core/workflow';

interface StatusCard {
  title: string;
  icon: string;
  count: number;
  iconColor: string;
  iconBackground: string;
}

interface AutoCompleteOption {
  label: string;
  value: string;
  icon?: string;
}

@Component({
  standalone: true,
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    AutoCompleteModule,
    ToolbarModule,
    TagModule,
    HeaderComponent,
    IconFieldModule,
    InputIconModule,
  ],
})
export class MenuComponent implements OnInit, OnDestroy {
  header = 'จัดการเมนู';

  // Form Group
  filterForm!: FormGroup;
  private destroy$ = new Subject<void>();

  allMenus: MenuResponseDTO[] = [];
  filteredMenus: MenuResponseDTO[] = [];

  // AutoComplete options data
  typeOptions: AutoCompleteOption[] = [
    { label: 'ทุกประเภท', value: '', icon: 'pi pi-list' },
    { label: 'อาหาร', value: 'food', icon: 'pi pi-shopping-bag' },
    { label: 'เครื่องดื่ม', value: 'drink', icon: 'pi pi-coffee' },
  ];

  statusOptions: AutoCompleteOption[] = [
    { label: 'ทุกสถานะ', value: '', icon: 'pi pi-list' },
    { label: 'เปิดขาย', value: 'active', icon: 'pi pi-check-circle' },
    { label: 'ปิดขาย', value: 'inactive', icon: 'pi pi-times-circle' },
  ];

  // Filtered options for AutoComplete
  filteredTypeOptions: AutoCompleteOption[] = [];
  filteredStatusOptions: AutoCompleteOption[] = [];

  // Selected values (objects for AutoComplete)
  selectedType: AutoCompleteOption | null = null;
  selectedStatus: AutoCompleteOption | null = null;

  statusCard: StatusCard[] = [];

  constructor(
    private menuFacade: MenuFacadeService,
    private appUtils: AppUtilsService,
    private fb: FormBuilder,
    private workflowFacade: WorkflowFacade
  ) {
    addIcons({ restaurant, fastFood, cafe, searchOutline });
    this.initializeForm();
  }

  async ngOnInit(): Promise<void> {
    this.setupFormValueChanges();
    await this.loadMenus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* =======================
   * Form Initialization
   * ======================= */
  private initializeForm(): void {
    this.filterForm = new FormGroup({
      searchText: this.fb.control(''),
      selectedType: this.fb.control<AutoCompleteOption | null>(null),
      selectedStatus: this.fb.control<AutoCompleteOption | null>(null),
    });
  }

  private setupFormValueChanges(): void {
    this.filterForm
      .get('searchText')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.applyFilters());

    this.filterForm
      .get('selectedType')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.applyFilters());

    this.filterForm
      .get('selectedStatus')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.applyFilters());
  }

  /* =======================
   * Data Loading
   * ======================= */
  async loadMenus(): Promise<void> {
    this.appUtils.showLoading();
    try {
      const response = await this.menuFacade.getMenus();
      if (!response) {
        throw new Error('No response from server');
      }
      this.allMenus = response;
      this.applyFilters();
    } catch (error) {
      console.log(error);
    } finally {
      this.appUtils.hideLoading();
    }
  }

  /* =======================
   * AutoComplete Methods
   * ======================= */
  searchType(event: any): void {
    const query = event.query.toLowerCase();
    this.filteredTypeOptions = this.typeOptions.filter(option =>
      option.label.toLowerCase().includes(query)
    );
  }

  searchStatus(event: any): void {
    const query = event.query.toLowerCase();
    this.filteredStatusOptions = this.statusOptions.filter(option =>
      option.label.toLowerCase().includes(query)
    );
  }

  /* =======================
   * Filtering
   * ======================= */
  onClearTypeFilter(): void {
    this.filterForm.patchValue({ selectedType: null }, { emitEvent: true });
  }

  onClearStatusFilter(): void {
    this.filterForm.patchValue({ selectedStatus: null }, { emitEvent: true });
  }

  private applyFilters(): void {
    const searchText = this.filterForm.get('searchText')?.value || '';
    const selectedType = this.filterForm.get('selectedType')?.value;
    const selectedStatus = this.filterForm.get('selectedStatus')?.value;

    this.filteredMenus = this.allMenus.filter(menu => {
      // Search filter
      if (
        searchText &&
        !menu.name.toLowerCase().includes(searchText.toLowerCase())
      ) {
        return false;
      }

      // Type filter
      const selectedTypeValue = selectedType || '';
      if (selectedTypeValue && menu.type !== selectedTypeValue) {
        return false;
      }

      // Status filter
      const selectedStatusValue = selectedStatus || '';
      if (selectedStatusValue === 'active' && !menu.is_active) {
        return false;
      }
      if (selectedStatusValue === 'inactive' && menu.is_active) {
        return false;
      }

      return true;
    });

    this.buildStatusCard();
  }

  /* =======================
   * Status Cards
   * ======================= */
  private buildStatusCard(): void {
    this.statusCard = [
      {
        title: 'เมนูทั้งหมด',
        icon: 'restaurant',
        count: this.filteredMenus.length,
        iconColor: '!text-blue-600',
        iconBackground: 'bg-blue-100',
      },
      {
        title: 'อาหาร',
        icon: 'restaurant',
        count: this.filteredMenus.filter(m => m.type === 'food').length,
        iconColor: '!text-green-600',
        iconBackground: 'bg-green-100',
      },
      {
        title: 'เครื่องดื่ม',
        icon: 'restaurant',
        count: this.filteredMenus.filter(m => m.type === 'drink').length,
        iconColor: '!text-orange-600',
        iconBackground: 'bg-orange-100',
      },
    ];
  }

  /* =======================
   * Workflow
   * ======================= */
  async openCreateUserWorkflow(): Promise<void> {
    console.log('implement next');

    await this.workflowFacade.startWorkflow('create-menu', {
      cssClass: 'modal-ninety',
      backdropDismiss: false,
    });
    // await this.workflowFacade.startWorkflowWithCallback(
    //   'create-menu',
    //   {
    //     onCancel: () => {
    //       console.log('User cancelled create menu');
    //     },
    //     onComplete: () => {
    //       this.loadMenus();
    //     },
    //   },
    //   {
    //     cssClass: 'modal-ninety',
    //   }
    // );
  }

  /* =======================
   * Helpers
   * ======================= */
  getMinPrice(menu: MenuResponseDTO): number {
    if (!menu.variants?.length) return 0;
    return Math.min(...menu.variants.map(v => v.price));
  }

  getMaxPrice(menu: MenuResponseDTO): number {
    if (!menu.variants?.length) return 0;
    return Math.max(...menu.variants.map(v => v.price));
  }

  /* =======================
   * Actions
   * ======================= */
  editMenu(menu: MenuResponseDTO): void {
    console.log('Edit menu:', menu);
  }

  async deleteMenu(menu: MenuResponseDTO): Promise<void> {
    if (!confirm(`ต้องการลบเมนู "${menu.name}" หรือไม่?`)) return;

    await this.menuFacade.deleteMenu(menu.id);
    this.loadMenus();
  }
}
