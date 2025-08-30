const StepTwoDetails = ({ formData, handleChange }) => (
  <div className="space-y-5">
    {/* Price Range */}
    <div className="form-control">
      <label className="label">
        <span className="label-text text-lg font-medium">Price Range</span>
      </label>
      <input
        type="text"
        name="price_range"
        className="input input-bordered h-13 p-3 w-full text-lg"
        placeholder="$500 - $2000"
        value={formData.price_range}
        onChange={handleChange}
      />
    </div>
  </div>
);
export default StepTwoDetails;
