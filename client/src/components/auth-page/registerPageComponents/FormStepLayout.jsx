// FormStepLayout.jsx
const FormStepLayout = ({ children }) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 text-white text-2xl">
      {children}
    </div>
  );
};

export default FormStepLayout;
