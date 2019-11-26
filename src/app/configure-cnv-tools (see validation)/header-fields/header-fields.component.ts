// import { HeaderFieldOld } from 'src/app/cnvtools/tab-file-mapping/tab-file-mapping.model';
// import { FormControl, Validators, FormArray, FormGroup } from '@angular/forms';
// import { Component, Input, OnInit } from '@angular/core';
// import { CustomValidators } from '../custom.validators';

// @Component({
//   selector: 'app-header-fields',
//   templateUrl: './header-fields.component.html',
//   styleUrls: ['./header-fields.component.scss']
// })
// export class HeaderFieldsComponent implements OnInit {
//   @Input() dataSource: HeaderFieldOld[];
//   @Input() isDisabled: boolean;
//   headerForm: FormGroup;

//   constructor() {}
//   displayedColumns: string[] = [
//     'no',
//     'cnvToolName',
//     'sampleName',
//     'chr',
//     'startBp',
//     'endBp',
//     'cnvType'
//   ];
//   ngOnInit() {
//     console.log(this.dataSource);
//     this.headerForm = new FormGroup({
//       headers: new FormArray(this.initCnvHeader())
//     });
//   }
//   getFormControl(i: number, fieldName: string) {
//     return (<FormArray>this.headerForm.get('headers')).at(i).get(fieldName);
//   }
//   getCnvToolNameFromDB() {
//     return ['dd'];
//   }
//   initCnvHeader(): FormGroup[] {
//     const formGroups: FormGroup[] = new Array<FormGroup>();
//     for (let i = 0; i < this.dataSource.length; i++) {
//       const formGroup = new FormGroup(
//         {
//           cnvToolName: new FormControl(
//             { value: null, disabled: this.isDisabled },
//             [
//               Validators.required,
//               CustomValidators.duplicatedInList(
//                 this.getCnvToolNameFromDB(),
//                 'alreadyHave'
//               )
//             ]
//           ),
//           sampleName: new FormControl(
//             { value: null, disabled: this.isDisabled },
//             [Validators.required]
//           ),
//           chr: new FormControl({ value: null, disabled: this.isDisabled }, [
//             Validators.required
//           ]),
//           startBp: new FormControl({ value: null, disabled: this.isDisabled }, [
//             Validators.required
//           ]),
//           endBp: new FormControl({ value: null, disabled: this.isDisabled }, [
//             Validators.required
//           ]),
//           cnvType: new FormControl({ value: null, disabled: this.isDisabled }, [
//             Validators.required
//           ])
//         },
//         [CustomValidators.duplicateInFormGroup]
//       );

//       formGroups.push(formGroup);
//     }
//     return formGroups;
//   }

//   onSelect(index, headerField, selectedValue) {
//     // console.log(`index: ${index}, headerField: ${headerField}, selectedValue: ${selectedValue}`);
//     // this.onSubmit();
//   }
//   onDebug() {
//     console.log(this.headerForm);
//   }
//   validate() {}
//   /*
//   // get data from Form
//   getVauleFormForm() {
//     const formArray: FormArray = this.headerForm.get('headers') as FormArray;
//     formArray.controls.forEach((formGroup) => {
//       const cnvToolName = formGroup.get('cnvToolName').value;
//       const sampleName = formGroup.get('sampleName').value;
//       const chr = formGroup.get('chr').value;
//       const startBp = formGroup.get('startBp').value;
//       const endBp = formGroup.get('endBp').value;
//       const cnvType = formGroup.get('cnvType').value;
//       const cnvTool: ChosenHeader = {
//         id: 1,
//         userId: 1,
//         cnvToolName: cnvToolName,
//         sampleName: sampleName,
//         chr: chr,
//         startBp: startBp,
//         endBp: endBp,
//         cnvType: cnvType
//       };
//       this.chosenHeader.push(cnvTool);
//     });
//   }
// */
// }
