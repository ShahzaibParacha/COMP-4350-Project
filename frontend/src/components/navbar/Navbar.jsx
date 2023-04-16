import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Disclosure } from "@headlessui/react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";

// import { Link } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Navbar() {
  // eslint-disable-next-line no-unused-vars
  const { userId } = JSON.parse(sessionStorage.getItem("session"));
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  const leftNavigation = [{ name: "Home", href: "/", current: false }];

  const rightNavigation = [
    { name: "Write", href: `/writer/${userId}/write`, current: false },
    { name: "Profile", href: `/writer/${userId}`, current: false },
    {
      name: "Logout",
      href: "/login",
      current: false,
    },
  ];

  function logout() {
    sessionStorage.clear();
    dispatch({ type: "CLEAR", payload: "" });
  }

  const handleNavClick = (e, item) => {
    e.preventDefault();

    if (item.href === "/login") {
      logout();
    }
    navigate(item.href);
  };

  return (
    <Disclosure as="nav" className="bg-neutral">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex items-center">
                  <img
                    className="hidden h-16 w-auto lg:block"
                    src="/logo-black.png"
                    alt="CASTr"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block flex items-center">
                  <div className="flex items-center">
                    {leftNavigation.map((item) => (
                      <button
                        type="button"
                        key={item.name}
                        onClick={(e) => handleNavClick(e, item)}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-white hover:bg-gray-700 hover:text-white",
                          "px-3 py-2 rounded-md text-lg font-bold mt-2.5"
                        )}
                        aria-current={item.current ? "page" : ""}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {rightNavigation.map((item) => (
                  <button
                    type="button"
                    key={item.name}
                    onClick={(e) => handleNavClick(e, item)}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-white hover:bg-gray-700 hover:text-white",
                      "px-3 py-2 rounded-md text-lg font-bold"
                    )}
                    aria-current={item.current ? "page" : ""}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {leftNavigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-white hover:bg-gray-700 hover:text-white",
                    "block px-3 py-2 rounded-md text-lg font-bold"
                  )}
                  aria-current={item.current ? "page" : ""}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export default Navbar;
