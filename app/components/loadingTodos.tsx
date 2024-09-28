import React from "react";

const LoadingTodos = () => {
    return (
        <tr className="bg-white text-gray-600 border-[0.1px] border-gray-100 ">
            <th>
                <div className="border-2 hover:border-gray-300 border-white p-2">
                    <div className="rounded-full w-4 h-4 bg-gray-300"/>
                </div>
            </th>
            <td className="h-full">
                <div className="w-full px-4 bg-slate-200 rounded-2xl animate-pulse h-4"/>
            </td>
        </tr>
    )
}
export default LoadingTodos;