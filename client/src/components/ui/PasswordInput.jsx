import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PasswordInput = ({
  id = "password",
  label = "Password",
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
    <div className="space-y-2">
      <Label htmlFor={id} className="text-base">{label}</Label>
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
          className="min-h-10 text-base pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      <div className="flex justify-between items-center mt-1">
        {touched && error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
        <a href="#" className="text-sm text-blue-600 hover:underline ml-auto">
          Forgot your password?
        </a>
      </div>
    </div>
  )
}

export default PasswordInput
