ได้เลย อันนี้คือ **เวอร์ชัน `.md`** จัดระเบียบให้อ่านง่าย ใช้เป็นเอกสารอธิบาย / แชร์ใน repo ได้ทันที
โค้ดเดิมไม่แตะตรรกะ แค่ทำให้มนุษย์อ่านแล้วไม่อยากร้องไห้

---

# Workflow Helpers – Usage Examples

เอกสารนี้แสดงตัวอย่างการใช้งาน `WorkflowHelper` ในหลายสถานการณ์
ตั้งแต่ form ธรรมดา ไปจนถึง async, conditional navigation และ custom logic
แนวคิดหลักคือ: **ลด if กระจัดกระจาย แล้วรวม logic ไว้ที่ helper**

---

## Example 1: Form Validation + Auto Sync

### แนวคิด

* ผูก `form.valid` เข้ากับ `canGoNext` อัตโนมัติ
* ไม่ต้องเขียน `valueChanges` เองให้รกสมอง

```ts
@Component({
  selector: 'app-example-auto-sync',
  template: `
    Name
    Email
  `
})
export class ExampleAutoSyncComponent extends BaseStepComponent {
  private helper!: WorkflowHelper;

  constructor(protected override workflowStep: WorkflowStepService) {
    super(workflowStep);
  }

  protected buildForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  protected override init(): void {
    this.helper = WorkflowHelper.create(this.workflowStep, this.form);
    this.helper.form.autoSyncFormValidity();
  }
}
```

---

## Example 2: Custom Validation + Multiple Conditions

### แนวคิด

* ไม่ได้ดูแค่ form
* ยังต้องดู state ภายนอก (upload, checkbox)

```ts
@Component({
  selector: 'app-example-multi-condition',
  template: `
    Upload Image
    Accept Terms
  `
})
export class ExampleMultiConditionComponent extends BaseStepComponent {
  private helper!: WorkflowHelper;

  imageUploaded = false;
  termsAccepted = false;

  constructor(protected override workflowStep: WorkflowStepService) {
    super(workflowStep);
  }

  protected buildForm(): FormGroup {
    return new FormGroup({
      imageUrl: new FormControl(''),
      terms: new FormControl(false)
    });
  }

  protected override init(): void {
    this.helper = WorkflowHelper.create(this.workflowStep, this.form);
    this.checkCanGoNext();
  }

  onImageSelected(event: any): void {
    this.imageUploaded = event.target.files.length > 0;
    this.checkCanGoNext();
  }

  private checkCanGoNext(): void {
    this.helper.navigation.enableNextIfAll([
      this.form!.valid,
      this.imageUploaded,
      this.termsAccepted
    ]);
  }
}
```

---

## Example 3: Async Operations

### แนวคิด

* async + loading + disable next
* ไม่ต้องเขียน `try/finally` ซ้ำทุกหน้า

```ts
@Component({
  selector: 'app-example-async',
  template: `
    Code
    {{ isLoading ? 'Verifying...' : 'Verify Code' }}
  `
})
export class ExampleAsyncComponent extends BaseStepComponent {
  private helper!: WorkflowHelper;

  isLoading = false;
  codeVerified = false;

  constructor(protected override workflowStep: WorkflowStepService) {
    super(workflowStep);
  }

  protected buildForm(): FormGroup {
    return new FormGroup({
      code: new FormControl('', Validators.required)
    });
  }

  protected override init(): void {
    this.helper = WorkflowHelper.create(this.workflowStep, this.form);
    this.helper.navigation.disableNext();
  }

  async verifyCode(): Promise<void> {
    const code = this.form!.get('code')?.value;

    await this.helper.async.withLoading(
      async () => {
        await new Promise(r => setTimeout(r, 2000));
        return { valid: code === '1234' };
      },
      {
        disableNextWhileLoading: true,
        onSuccess: (result) => {
          if (result.valid) {
            this.codeVerified = true;
            this.helper.navigation.enableNext();
          }
        },
        onError: (error) => {
          console.error('Verification failed:', error);
        }
      }
    );

    this.isLoading = this.helper.async.getLoadingState();
  }
}
```

---

## Example 4: Conditional Navigation

### แนวคิด

* หน้าเดียว แต่ไปคนละ step
* `beforeNext` เป็นด่านตรวจสุดท้าย

```ts
@Component({
  selector: 'app-example-conditional',
  template: `
    User Type
    Admin
    User
  `
})
export class ExampleConditionalComponent extends BaseStepComponent {
  private helper!: WorkflowHelper;

  constructor(protected override workflowStep: WorkflowStepService) {
    super(workflowStep);
  }

  protected buildForm(): FormGroup {
    return new FormGroup({
      userType: new FormControl('user', Validators.required)
    });
  }

  protected override init(): void {
    this.helper = WorkflowHelper.create(this.workflowStep, this.form);
    this.helper.form.autoSyncFormValidity();
  }

  protected override async beforeNext(): Promise<boolean> {
    const userType = this.form!.get('userType')?.value;

    this.helper.conditional.goToStepIf(
      () => userType === 'admin',
      'admin-settings',
      'user-settings'
    );

    return false;
  }
}
```

---

## Example 5: Data Management

### แนวคิด

* รวม data จากหลาย step
* ใช้เป็น summary / review page

```ts
@Component({
  selector: 'app-example-data-management',
  template: `
    Summary
    -------
    {{ summaryData | json }}
  `
})
export class ExampleDataManagementComponent extends BaseStepComponent {
  private helper!: WorkflowHelper;

  summaryData: any = {};

  constructor(protected override workflowStep: WorkflowStepService) {
    super(workflowStep);
  }

  protected buildForm(): FormGroup {
    return new FormGroup({});
  }

  protected override init(): void {
    this.helper = WorkflowHelper.create(this.workflowStep);

    this.summaryData = this.helper.data.mergeStepsData([
      'user-info',
      'address',
      'payment'
    ]);

    const [firstName, lastName, email] =
      this.helper.data.getStepFields('user-info', [
        'firstName',
        'lastName',
        'email'
      ]);

    console.log('User:', firstName, lastName, email);

    this.helper.navigation.enableNext();
  }
}
```

---

## Example 6: Complex Form with Custom Logic

### แนวคิด

* validation เปลี่ยนตาม state
* logic เยอะ แต่ไม่เละ

```ts
@Component({
  selector: 'app-example-complex',
  template: `
    Has Previous Experience?
    Years of Experience
    Upload Resume
  `
})
export class ExampleComplexComponent extends BaseStepComponent {
  private helper!: WorkflowHelper;

  resumeUploaded = false;

  constructor(protected override workflowStep: WorkflowStepService) {
    super(workflowStep);
  }

  protected buildForm(): FormGroup {
    return new FormGroup({
      hasExperience: new FormControl(false),
      yearsOfExperience: new FormControl('')
    });
  }

  protected override init(): void {
    this.helper = WorkflowHelper.create(this.workflowStep, this.form);

    this.form!.get('hasExperience')?.valueChanges.subscribe(hasExp => {
      const years = this.form!.get('yearsOfExperience');

      if (hasExp) {
        years?.setValidators([Validators.required, Validators.min(1)]);
      } else {
        years?.clearValidators();
        years?.setValue('');
      }

      years?.updateValueAndValidity();
      this.updateCanGoNext();
    });

    this.updateCanGoNext();
  }

  onFileSelected(event: any): void {
    this.resumeUploaded = event.target.files.length > 0;
    this.updateCanGoNext();
  }

  private updateCanGoNext(): void {
    const hasExperience = this.form!.get('hasExperience')?.value;

    const conditions = [
      this.form!.valid,
      this.resumeUploaded
    ];

    if (hasExperience) {
      const years = this.form!.get('yearsOfExperience')?.value;
      conditions.push(years > 0);
    }

    this.helper.navigation.enableNextIfAll(conditions);
  }
}
```

---

## Example 7: Manual Control

### แนวคิด

* flow ไม่เกี่ยวกับ form
* ใช้ workflow เป็น state machine ล้วน ๆ

```ts
@Component({
  selector: 'app-example-manual-control',
  template: `
    Please wait while we process your data...
    {{ statusMessage }}
  `
})
export class ExampleManualControlComponent extends BaseStepComponent {
  private helper!: WorkflowHelper;

  progress = 0;
  statusMessage = 'Starting...';

  constructor(protected override workflowStep: WorkflowStepService) {
    super(workflowStep);
  }

  protected buildForm(): FormGroup {
    return new FormGroup({});
  }

  protected override init(): void {
    this.helper = WorkflowHelper.create(this.workflowStep);
    this.helper.navigation.disableNext();
    this.startProcessing();
  }

  private async startProcessing(): Promise<void> {
    const steps = [
      { message: 'Validating data...', duration: 1000 },
      { message: 'Uploading files...', duration: 2000 },
      { message: 'Processing...', duration: 1500 },
      { message: 'Complete!', duration: 500 }
    ];

    for (let i = 0; i < steps.length; i++) {
      this.statusMessage = steps[i].message;
      this.progress = (i + 1) / steps.length;

      await this.helper.async.withLoading(
        () => new Promise(r => setTimeout(r, steps[i].duration)),
        { disableNextWhileLoading: false }
      );
    }

    this.helper.navigation.enableNext();
  }
}
```

---

## สรุปแบบไม่อวยเกินจริง

`WorkflowHelper` เหมาะมากกับ flow ที่

* มีหลายเงื่อนไข
* มี async
* มีการกระโดด step
* และไม่อยากให้ component กลายเป็นก๋วยเตี๋ยวรวมมิตร

มันไม่ได้เวทมนตร์
แต่มันช่วยให้โค้ด **คิดเป็นระบบเดียวกัน** มากขึ้น
ซึ่งในโลกจริง นี่คือของหายากยิ่งกว่าบั๊กที่แก้ครั้งเดียวหาย
