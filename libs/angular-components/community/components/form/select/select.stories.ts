import { moduleMetadata, StoryObj, Meta } from "@storybook/angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SelectComponent } from "./select.component";
import { LabelComponent } from "../label/label.component";
import { FormFieldComponent } from "../form-field/form-field.component";
import { FeedbackTextComponent } from "../feedback-text/feedback-text.component";

export default {
  title: "Community Angular/Form/Select",
  component: SelectComponent,
  decorators: [
    moduleMetadata({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SelectComponent,
        LabelComponent,
        FormFieldComponent,
        FeedbackTextComponent,
      ],
    }),
  ],
  argTypes: {
    size: { control: "radio", options: ["small", "default"] },
    state: { control: "radio", options: ["default", "valid", "error"] },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    labelText: { control: "text" },
    required: { control: "boolean" },
    hintText: { control: "text" },
    validText: { control: "text" },
    errorText: { control: "text" },
  },
} as Meta<SelectComponent>;

type Story = StoryObj<
  SelectComponent & {
    labelText: string;
    required: boolean;
    hintText: string;
    validText: string;
    errorText: string;
  }
>;

const SAMPLE_OPTIONS = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
  { value: "option4", label: "Option 4 (Disabled)", disabled: true },
  { value: "option5", label: "Option 5" },
];

export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      options: SAMPLE_OPTIONS,
      onSelectionChange: (value: any) =>
        console.log("Selection changed:", value),
    },
    template: `
      <tedi-form-field>
        <label tedi-label [for]="'storybook-select'" [required]="required">{{ labelText }}</label>
        <tedi-select
          id="storybook-select"
          [size]="size"
          [state]="state"
          [disabled]="disabled"
          [placeholder]="placeholder"
          [options]="options"
          (selectionChange)="onSelectionChange($event)"
        ></tedi-select>
        @if (errorText && state === 'error') {
          <tedi-feedback-text type="error" [text]="errorText" />
        } @else if (validText && state === 'valid') {
          <tedi-feedback-text type="valid" [text]="validText" />
        } @else if (hintText) {
          <tedi-feedback-text type="hint" [text]="hintText" />
        }
      </tedi-form-field>
    `,
  }),
  args: {
    size: "default",
    state: "default",
    disabled: false,
    placeholder: "Select an option",
    labelText: "Select option",
    required: false,
    hintText: "Please select one option from the list",
    validText: "",
    errorText: "",
  },
};

export const WithValidFeedback: Story = {
  ...Default,
  args: {
    ...Default.args,
    state: "valid",
    hintText: "",
    validText: "Valid selection",
  },
};

export const WithErrorFeedback: Story = {
  ...Default,
  args: {
    ...Default.args,
    state: "error",
    hintText: "",
    errorText: "Please select a valid option",
  },
};

export const Small: Story = {
  ...Default,
  args: {
    ...Default.args,
    size: "small",
  },
};

export const Disabled: Story = {
  ...Default,
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const Required: Story = {
  ...Default,
  args: {
    ...Default.args,
    required: true,
  },
};
