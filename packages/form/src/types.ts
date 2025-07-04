import { ConstraintValidation } from "@material/web/labs/behaviors/constraint-validation.js";

export type MimeTypesT = "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain";
// export type FormMethodT = 'get' | 'post';

export interface FormFieldI extends ConstraintValidation {
  focus(options?: FocusOptions): void;
  blur(): void;
  value?: string;
  selected?: string[];
}
