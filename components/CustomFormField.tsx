import Image from "next/image";
import ReactDatePicker from "react-datepicker";
import { E164Number } from "libphonenumber-js/core";
import PhoneInput from "react-phone-number-input";
import { Control } from "react-hook-form";

import { Checkbox } from "./ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

export enum FieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE = "phone",
  CHECKBOX = "checkbox",
  DATE = "date",
  SELECT = "select",
  SKELETON = "skeleton",
}

interface FormFieldProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FieldType;
}

const InputRenderer = ({
  field,
  config,
}: {
  field: any;
  config: FormFieldProps;
}) => {
  switch (config.fieldType) {
    case FieldType.INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          {config.iconSrc && (
            <Image
              src={config.iconSrc}
              height={24}
              width={24}
              alt={config.iconAlt || "icon"}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              placeholder={config.placeholder}
              {...field}
              className="shad-input border-0"
            />
          </FormControl>
        </div>
      );

    case FieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={config.placeholder}
            {...field}
            className="shad-textArea"
            disabled={config.disabled}
          />
        </FormControl>
      );

    case FieldType.PHONE:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="ET"
            international
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            placeholder={config.placeholder}
            className="input-phone"
          />
        </FormControl>
      );

    case FieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={config.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={config.name} className="checkbox-label">
              {config.label}
            </label>
          </div>
        </FormControl>
      );

    case FieldType.DATE:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          <Image
            src="/assets/icons/calendar.svg"
            height={24}
            width={24}
            alt="calendar"
            className="ml-2"
          />
          <FormControl>
            <ReactDatePicker
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              showTimeSelect={config.showTimeSelect ?? false}
              dateFormat={config.dateFormat ?? "MM/dd/yyyy"}
              wrapperClassName="date-picker"
            />
          </FormControl>
        </div>
      );

    case FieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="shad-select-trigger">
                <SelectValue placeholder={config.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="shad-select-content">
              {config.children}
            </SelectContent>
          </Select>
        </FormControl>
      );

    case FieldType.SKELETON:
      return config.renderSkeleton?.(field) ?? null;

    default:
      return null;
  }
};

const CustomFormField = (props: FormFieldProps) => {
  const { control, name, label, fieldType } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {fieldType !== FieldType.CHECKBOX && label && (
            <FormLabel className="shad-input-label">{label}</FormLabel>
          )}
          <InputRenderer field={field} config={props} />
          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
