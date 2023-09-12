export default function HeaderTimer() {
  return (
    <>
      {/* Selectors category/cube */}
      <div className="flex flex-row justify-center gap-20 p-4">
        <div id="select-category">
          <label
            htmlFor="category"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Category
          </label>
          <select
            id="category"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option>2x2</option>
            <option>3x3</option>
            <option>4x4</option>
            <option>5x5</option>
          </select>
        </div>
        <div id="select-cube">
          <label
            htmlFor="cube"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            SpeedCube
          </label>
          <select
            id="category"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option>Guanlong | 3x3</option>
            <option>Gan 356 | 3x3</option>
          </select>
        </div>
      </div>
    </>
  );
}
