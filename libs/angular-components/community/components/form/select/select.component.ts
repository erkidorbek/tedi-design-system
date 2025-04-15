import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  input,
  OnDestroy,
  Output,
  signal,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { InputComponent } from "../input/input.component";
import { IconComponent } from "@tehik-ee/tedi-angular/tedi";

export type SelectSize = "small" | "default";
export type SelectState = "valid" | "error" | "default";

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: "tedi-select",
  templateUrl: "./select.component.html",
  styleUrl: "./select.component.scss",
  standalone: true,
  imports: [CommonModule, InputComponent, IconComponent],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class.tedi-select]": "true",
    "[class]": "modifierClasses()",
    "[attr.aria-expanded]": "isOpen()",
    "[attr.aria-disabled]": 'disabled() ? "true" : null',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor, OnDestroy {
  @ViewChild("selectContainer") selectContainer!: ElementRef;

  /**
   * Size of the select.
   * @default default
   */
  size = input<SelectSize>("default");

  /**
   * State of the select.
   * @default default
   */
  state = input<SelectState>("default");

  /**
   * Whether the select is disabled.
   * @default false
   */
  disabled = input<boolean>(false);

  /**
   * Placeholder text when no value selected.
   * @default ""
   */
  placeholder = input<string>("");

  /**
   * Available options for the select.
   * @default []
   */
  options = input<SelectOption[] | any[]>([]);

  /**
   * Name of the property to use as the option value.
   * @default "value"
   */
  valueKey = input<string>("value");

  /**
   * Name of the property to use as the option label.
   * @default "label"
   */
  labelKey = input<string>("label");

  /**
   * Name of the property to use to determine if an option is disabled.
   * @default "disabled"
   */
  disabledKey = input<string>("disabled");

  /**
   * Event emitted when selection changes.
   */
  @Output() selectionChange = new EventEmitter<any>();

  // Internal signals
  value = signal<any>(null);
  isOpen = signal<boolean>(false);

  // Computed properties
  normalizedOptions = computed(() => {
    const options = this.options();
    if (!options || options.length === 0) return [];

    // Check if options are already in the correct format
    if (options[0] && "value" in options[0] && "label" in options[0]) {
      return options as SelectOption[];
    }

    // Otherwise, normalize the options based on the configured keys
    return options.map((item) => ({
      value: item[this.valueKey()],
      label: item[this.labelKey()],
      disabled: this.disabledKey() ? !!item[this.disabledKey()] : false,
      originalItem: item, // Keep reference to original item
    }));
  });

  selectedLabel = computed(() => {
    const currentValue = this.value();
    const found = this.normalizedOptions()?.find(
      (option) => option.value === currentValue,
    );
    return found?.label || this.placeholder();
  });

  modifierClasses = computed(() => {
    const modifiers = [];
    // if (this.size()) modifiers.push(`tedi-select--${this.size()}`);
    // if (this.state()) modifiers.push(`tedi-select--${this.state()}`);
    if (this.isOpen()) modifiers.push("tedi-select--open");
    // if (this.disabled()) modifiers.push("tedi-select--disabled");
    return modifiers.join(" ");
  });

  // Control Value Accessor methods
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.value.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // UI interaction methods
  toggleDropdown(): void {
    if (this.disabled()) return;

    this.isOpen.update((value) => !value);
    this.onTouched();
  }

  clearSelection(event: Event): void {
    event.stopPropagation(); // Prevent triggering the dropdown toggle
    this.value.set(null);
    this.onChange(null);
    this.selectionChange.emit(null);
  }

  selectOption(option: SelectOption): void {
    if (this.disabled() || option.disabled) return;

    this.value.set(option.value);
    this.onChange(option.value);
    this.selectionChange.emit(option.value);
    this.isOpen.set(false);
  }

  @HostListener("document:click", ["$event"])
  onClickOutside(event: Event): void {
    if (
      this.isOpen() &&
      this.selectContainer &&
      !this.selectContainer.nativeElement.contains(event.target)
    ) {
      this.isOpen.set(false);
    }
  }

  @HostListener("keydown", ["$event"])
  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled()) return;

    switch (event.key) {
      case "Escape":
        this.isOpen.set(false);
        break;
      case "Enter":
      case " ":
        if (!this.isOpen()) {
          this.isOpen.set(true);
          event.preventDefault();
        }
        break;
      case "ArrowDown":
      case "ArrowUp":
        if (!this.isOpen()) {
          this.isOpen.set(true);
          event.preventDefault();
        }
        break;
    }
  }

  ngOnDestroy(): void {
    this.selectionChange.complete();
  }
}
