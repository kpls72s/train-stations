import React, { useCallback, useEffect, useState } from "react";

export const ListComponent: React.FC<{
  title: string;
  description: string;
  filter: (value: string) => void;
  options: Array<{ id: number; option: string; value: string | number }>;
  isReset: boolean;
}> = ({ title, description, filter, options, isReset }) => {
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    if (isReset) setValue("");
  }, [isReset]);

  const onChangeFunction = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
    filter(e.target.value);
  }, [filter]);

  
  return (
    <div className="w-full mx-2">
      <div className="w-full flex-wrap flex lg:flex-col justify-center items-center h-20 lg:h-auto ">
        <label
          htmlFor={title}
          className="w-full text-center text-gray-900 dark:text-white "
        >
          {description}
        </label>
        <select
          value={value}
          onChange={onChangeFunction}
          id={title}
          className="w-11/12 dark:bg-gray-900 dark:text-white border-2 dark:border-amber-100 p-2 rounded-sm  text-center  focus:outline-blue-200 focus:border-blue-400 focus:outline-4"
        >
          <option value="">Choose a {title}</option>
          {options.map((option) => {
            return (
              <option key={option.id} value={option.value}>
                {option.option}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};
