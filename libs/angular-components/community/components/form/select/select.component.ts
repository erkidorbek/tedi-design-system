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
  imports: [CommonModule],
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
   * @default "Select an option"
   */
  placeholder = input<string>("Select an option");

  /**
   * Available options for the select.
   * @default []
   */
  options = input<SelectOption[]>([]);

  /**
   * Event emitted when selection changes.
   */
  @Output() selectionChange = new EventEmitter<any>();

  // Internal signals
  value = signal<any>(null);
  isOpen = signal<boolean>(false);

  // Computed properties
  selectedLabel = computed(() => {
    const currentValue = this.value();
    const found = this.options()?.find(
      (option) => option.value === currentValue,
    );
    return found?.label || this.placeholder();
  });

  modifierClasses = computed(() => {
    const modifiers = [];
    if (this.size()) modifiers.push(`tedi-select--${this.size()}`);
    if (this.state()) modifiers.push(`tedi-select--${this.state()}`);
    if (this.isOpen()) modifiers.push("tedi-select--open");
    if (this.disabled()) modifiers.push("tedi-select--disabled");
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

  // setDisabledState(isDisabled: boolean): void {
  //   this.disabled.update(() => isDisabled);
  // }

  // UI interaction methods
  toggleDropdown(): void {
    if (this.disabled()) return;

    this.isOpen.update((value) => !value);
    this.onTouched();
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
