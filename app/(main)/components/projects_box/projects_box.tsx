import { IoSearch } from "react-icons/io5";

const visibilityOptions = ['Public', 'Permission', 'Private'];
export const ProjectsBox = () => {
  return (
 <div className="py-8">
     <div className="p-4 bg-gray-100 rounded-lg shadow-md h-unit-9xl" style={{ height: '55rem' }}>
    
    <div className="bg-white p-8 rounded-lg shadow-lg w-full flex flex-col items-center h-full">
          <h1 className="text-2xl text-gray-800 font-bold leading-snug mb-5 text-center">Discover projects</h1>
      <div className="flex items-center border-2 rounded-lg bg-gray-100 md:w-1/2">
        <input
          className="flex-grow p-4 rounded-lg bg-transparent focus:outline-none"
          type="text"
          placeholder="Search for projects..."
        />
        <button className="p-4">
          <IoSearch className="h-5 w-5 text-gray-500" />
        </button>
      </div>
        <div className="flex items-center pt-3">
        {visibilityOptions.map((option) => (
          <button
            key={option}
        
            className={`text-sm p-2 rounded-lg hover:bg-blue-100 mr-2 ${
              "JavaScript" === option ? 'bg-blue-200 font-semibold' : 'bg-transparent'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
  </div>
</div>
  </div>)
}


