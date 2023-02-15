import React from "react";

function WidePost() {
  const postData = {
    name: "FirstName LastName",
    occupation: "Occupation",
    text:
      "                Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim\n" +
      "                incididunt cillum culpa consequat. Excepteur qui ipsum aliquip\n" +
      "                consequat sint. Sit id mollit nulla mollit nostrud in ea officia\n" +
      "                proident. Irure nostrud pariatur mollit ad adipisicing\n" +
      "                reprehenderit deserunt qui eu.",
  };

  return (
    <button
      type="button"
      className="overflow-hidden text-left font-base bg-white m-6 shadow px-6 sm:rounded-m"
    >
      <div className="bg-gray-50 px-6 py-5 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6">
        <div className="px-4 py-2 col-start-1 col-end-2 sm:px-6">
          <h3 className="text-lg font-base font-medium leading-6 text-gray-900">
            {postData.name}
          </h3>
          <p className="mt-1 font-base max-w-2xl text-sm text-gray-500">
            {postData.occupation}
          </p>
          <p className="mt-1 border-t font-base max-w-2xl text-sm text-gray-500">
            11 likes
          </p>
        </div>
        <div className="px-4 py-2 col-start-2 col-span-5 sm:px-6">
          <div className="border-l border-neutral">
            <div className="bg-gray-50 px-6 py-5 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6">
              <dd className="mt-1 text-sm font-base text-gray-900 sm:col-span-6 sm:mt-0">
                {postData.text}
              </dd>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

export default WidePost;
