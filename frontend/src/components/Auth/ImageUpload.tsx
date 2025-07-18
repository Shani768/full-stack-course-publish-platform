type Props = {
  imagePreview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ImageUpload = ({ imagePreview, onChange }: Props) => {
  return (
    <div className="flex flex-col items-center">
      {imagePreview ? (
        <img
          src={imagePreview}
          alt="Preview"
          className="w-24 h-24 rounded-full object-cover mb-2"
        />
      ) : (
        <div className="w-24 h-24 bg-gray-200 rounded-full mb-2 flex items-center justify-center text-gray-500 text-sm">
          No Image
        </div>
      )}
      <label className="cursor-pointer text-sm text-indigo-600 hover:underline">
        Upload Profile Picture
        <input type="file" accept="image/*" onChange={onChange} className="hidden" />
      </label>
    </div>
  );
};


export default ImageUpload;
