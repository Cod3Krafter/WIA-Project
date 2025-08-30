import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PasswordInput = ({
  id = "password",
  label = "",
  name = "password",
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = true,
  placeholder = "Enter your password",
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="space-y-2 w-full sm:w-11/12 mx-auto">
      {label && (
        <Label htmlFor={id} className="text-base text-neutral-50 flex items-center gap-1">
          {label}{required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          placeholder={placeholder}
          className="h-14 sm:h-16 md:h-18 text-neutral-50 text-lg pr-10 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all w-full"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      <div className="flex justify-between items-center mt-1">
        {touched && error && (
          <p className="text-md sm:text-[2px] text-red-500">{error}</p>
        )}
        <a href="#" className="text-lg sm:text-xs text-blue-600 hover:underline ml-auto">
          Forgot your password?
        </a>
      </div>
    </div>
  )
}

export default PasswordInput
