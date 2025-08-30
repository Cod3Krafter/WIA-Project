import { Label } from "../../../components/ui/label";

const FormField = ({ label, error, touched, children }) => {
  return (
    <div className="space-y-3">
      {label && (
        <Label className="flex items-center gap-2 text-md font-medium text-neutral-50">
          {typeof label === "string" ? <span>{label}</span> : label}
        </Label>
      )}
      <div>{children}</div>
      <p className="min-h-6 text-red-500 text-md">
          {touched && error ? error : ""}
        </p>

    </div>
  );
};

export default FormField;
