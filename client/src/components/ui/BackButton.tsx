import { FiArrowLeft } from "react-icons/fi";

export default function BackButton() {
  return (
    <button onClick={() => window.history.back()} className="text-xl">
      <FiArrowLeft />
    </button>
  );
}
