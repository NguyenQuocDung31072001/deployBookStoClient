import React from 'react'
import logoFooter from '../logo_footer.svg'
const Footer = () => {
  return (
    <div className="w-[100%] mt-[50px] h-[200px] bg-black flex justify-around items-center">
      <div>
        <img
          className="w-[200px] h-[200px] object-cover"
          src={logoFooter}
          alt=""
        />
      </div>
      <div className="">
        <h1 className="text-white">Nguyễn Quốc Dũng</h1>
      </div>
      <div className="text-white">
        <h1 className="text-white">Trần Lương Ngyên</h1>
      </div>
    </div>
  )
}

export default Footer
