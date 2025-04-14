import { moduleMetadata, StoryObj, Meta } from "@storybook/angular";
import { SelectComponent } from "./select.component";

export default {
  title: "Community Angular/Form/Select",
  component: SelectComponent,
  decorators: [
    moduleMetadata({
      imports: [SelectComponent],
    }),
  ],
  argTypes: {
    size: { control: "radio", options: ["small", "default"] },
    state: { control: "radio", options: ["default", "valid", "error"] },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
} as Meta<SelectComponent>;

type Story = StoryObj<
  SelectComponent & {
    labelText: string;
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
        <tedi-select
          id="storybook-select"
          [size]="size"
          [state]="state"
          [disabled]="disabled"
          [placeholder]="placeholder"
          [options]="options"
          (selectionChange)="onSelectionChange($event)"
        />
    `,
  }),
  args: {
    size: "default",
    state: "default",
    disabled: false,
    placeholder: "Select an option",
  },
};

export const WithValidFeedback: Story = {
  ...Default,
  args: {
    ...Default.args,
    state: "valid",
  },
};

export const WithErrorFeedback: Story = {
  ...Default,
  args: {
    ...Default.args,
    state: "error",
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
