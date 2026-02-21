export default function ListSkeleton() {
  return (
    <div className="w-full m-2 flex flex-col items-center">
      <div className="w-[90%] text-gray-900 dark:text-white  flex justify-center mb-4">
        <div className="flex animate-pulse w-3/12">
          <div className="flex-1">
            <div className="h-2 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>

      <div className=" w-[90%] rounded-md dark:text-white border-2 border-gray-200 dark:border-amber-100 h-10 flex justify-center items-center">
        <div className="flex animate-pulse w-6/12">
          <div className="flex-1">
            <div className="h-2 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
