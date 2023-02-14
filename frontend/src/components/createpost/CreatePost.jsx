import React from "react";

function CreatePost() {
  return (
    <div className="bg-base-100">
      <div className="grid grid-rows-4 grid-cols-6 gap-4">
        <div className="row-start-1 row-end-5 bg-black-600 row-span-2 h-screen" />
        <div className="row-start-1 col-start-2 bg-neutral col-span-4 row-end-5 h-screen">
          <div className="grid-column-1 h-screen" />
          <input />
        </div>
        <div className="row-start-1 row-end-5 h-screen" />
      </div>
    </div>
  );
}

export default CreatePost;
