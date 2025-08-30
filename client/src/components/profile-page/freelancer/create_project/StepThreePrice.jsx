const StepThreePrice = ({ formData, handleChange }) => {
  return (
    <div className="form-control">
      <label className="label text-lg font-medium mb-2">
        Price Range <span className="text-error">*</span>
      </label>
      <input
        type="text"
        name="price_range"
        value={formData.price_range}
        onChange={handleChange}
        placeholder="e.g., $200 - $500"
        className="input input-bordered w-full h-13 text-lg"
        required
      />
    </div>
  );
};

export default StepThreePrice;
