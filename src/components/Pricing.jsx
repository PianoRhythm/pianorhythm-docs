import React from 'react';

const NoCheckMark = () => {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-label="Not included in Standard plan" className="w-5 h-5 mx-auto dark:dark:text-gray-600">
    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
  </svg>;
};

const CheckMark = () => {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-label="Included in Standard plan" className="w-5 h-5 mx-auto dark:dark:text-violet-400">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
  </svg>;
};

const Pricing = () => {
  return (<>
    <section className="dark:dark:text-gray-100">
      <div className="container mx-auto p-6 overflow-x-auto">
        <table className="w-full">
          <caption className="sr-only">Pricing plan comparison</caption>
          <thead>
            <tr>
              <th></th>
              <th scope="col">
                <h2 className="px-2 text-lg font-medium">Free</h2>
                <p className="mb-3">
                  <span className="text-2xl font-bold sm:text-3xl dark:dark:text-gray-50">0$</span>
                  <span className="font-medium dark:dark:text-gray-400">/mo</span>
                </p>
              </th>
              <th scope="col">
                <h2 className="px-2 text-lg font-medium">PRO</h2>
                <p className="mb-3">
                  <span className="text-2xl font-bold sm:text-3xl dark:dark:text-gray-50">5$</span>
                  <span className="font-medium dark:dark:text-gray-400">/mo</span>
                </p>
              </th>
            </tr>
          </thead>
          <tbody className="space-y-6 text-center divide-y divide-gray-700">
            <tr>
              <th scope="row" className="text-left">
                <h4 className="py-3">Play piano with other people!</h4>
              </th>
              <td><CheckMark /></td>
              <td><CheckMark /></td>
            </tr>
            <tr>
              <th scope="row" className="text-left">
                <h4 className="py-3">Access to an exclusive PRO lobby</h4>
              </th>
              <td><NoCheckMark /></td>
              <td><CheckMark /></td>
            </tr>
            <tr>
              <th scope="row" className="text-left">
                <h4 className="py-3">Custom PRO badge and tag associated with your username</h4>
              </th>
              <td><NoCheckMark /></td>
              <td><CheckMark /></td>
            </tr>
            <tr>
              <th scope="row" className="text-left">
                <h4 className="py-3">Access to a custom 'Rainbow' color</h4>
              </th>
              <td><NoCheckMark /></td>
              <td><CheckMark /></td>
            </tr>
            <tr>
              <th scope="row" className="text-left">
                <h4 className="py-3">Increase the max players to 50 in a self hosted room (Coming Soon)</h4>
              </th>
              <td><NoCheckMark /></td>
              <td><CheckMark /></td>
            </tr>
            <tr>
              <th scope="row" className="text-left">
                <h4 className="py-3">Ability to host permanent rooms (Coming Soon)</h4>
              </th>
              <td><NoCheckMark /></td>
              <td><CheckMark /></td>
            </tr>
            <tr>
              <th scope="row" className="text-left">
                <h4 className="py-3">Upload .gifs as your Avatar Profiles/Background</h4>
              </th>
              <td>
                <NoCheckMark />
                {/* <span className="block text-sm">1</span> */}
              </td>
              <td>
                <CheckMark />
              </td>
            </tr>
            <tr>
              <th scope="row" className="text-left">
                <h4 className="py-3">More features coming!</h4>
              </th>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </>);
};

export default Pricing;