import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  input,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { CdkMenu, CdkMenuModule, CdkMenuItem } from "@angular/cdk/menu";
import { SelectOption } from "../select.component";
import {
  CardComponent,
  CardContentComponent,
} from "community/components/cards/card";

@Component({
  selector: "tedi-dropdown",
  standalone: true,
  imports: [CdkMenuModule, CardComponent, CardContentComponent],
  templateUrl: "./dropdown.component.html",
  styleUrl: "./dropdown.component.scss",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class.tedi-dropdown]": "true",
  },
})
export class DropdownComponent {
  /**
   * Options to display in the dropdown
   */
  options = input<SelectOption[]>([]);

  /**
   * Currently selected value
   */
  selectedValue = input<any>(null);

  /**
   * Emitted when an option is selected
   */
  @Output() optionSelected = new EventEmitter<SelectOption>();

  /**
   * Handle option selection
   */
  selectOption(option: SelectOption): void {
    if (!option.disabled) {
      this.optionSelected.emit(option);
    }
  }

  /**
   * Check if an option is selected
   */
  isSelected(option: SelectOption): boolean {
    return this.selectedValue() === option.value;
  }
}
