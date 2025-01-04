/* eslint-disable react/prop-types */

const PetTypeCard = ({petType, petIcon}) => {
    return (
      <>
          <div className=" bg-white hover:cursor-pointer  border-[0.5px] border-grey-250 drop-shadow-2xl bg-transparent backdrop-blur-lg p-2 rounded-lg transition-transform duration-300 transform hover:scale-110">
            {/* <img
              className="rounded-xl"
              src={petImage}
              height="150px"
              width="150px"
              alt="pet type image"
            /> */}
            <div className="px-20">
            {petIcon}
            </div>
            
            <h2 className="text-2xl  text-center text-black font-extralight">{petType}</h2>
        </div>
      </>
    );
  };
  
  export default PetTypeCard;
  