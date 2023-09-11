import Navigation from "@/components/Navigation";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Selectors category/cube */}
      <div className="flex flex-row justify-center gap-20 p-4">
        <div id="select-category">
          <label htmlFor="select-category">Select Category</label>
          <select name="select-category">
            <option value="value1">Value 1</option>
            <option value="value2">Value 2</option>
            <option value="value3">Value 3</option>
          </select>
        </div>
        <div id="select-cube">
          <label htmlFor="select-cube">Select Cube</label>
          <select name="select-cube">
            <option value="value1">Value 1</option>
            <option value="value2">Value 2</option>
            <option value="value3">Value 3</option>
          </select>
        </div>
      </div>
      {/* Timer */}
      <section className="flex flex-col items-center justify-center">
        <div className="text-9xl font-mono">0.00</div>
        {/* Selector options */}
        <div className="flex gap-3">
          <button type="button" className="border-2 border-slate-500">
            Delete
          </button>
          <button type="button" className="border-2 border-slate-500">
            +2
          </button>
          <button type="button" className="border-2 border-slate-500">
            Mark
          </button>
          <button type="button" className="border-2 border-slate-500">
            Comment
          </button>
        </div>
      </section>
    </>
  );
}
