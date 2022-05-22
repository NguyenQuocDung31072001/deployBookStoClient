import React from 'react'
import { Slide, Fade } from 'react-slideshow-image'
import 'react-slideshow-image/dist/styles.css'

const slideImages = [
  { 
    url: 'https://visme.co/blog/wp-content/uploads/2020/05/Header-38.jpg'
  },
  {
    url: 'https://image.shutterstock.com/image-vector/open-ebook-on-digital-tablet-260nw-1362218150.jpg'
  },
  {
    url: 'http://don16obqbay2c.cloudfront.net/wp-content/uploads/Sell-Ebooks-Online-1579266163.png'
  },
  {
    url: 'https://www.000webhost.com/blog/wp-content/uploads/sites/15/2019/04/how-to-make-ebook.png'
  },
  {
    url: 'https://www.sodapdf.com/blog/wp-content/uploads/2019/06/ereaders.jpg'
  }
]

const SlideshowUser = () => {
  return (
    <div className="w-[90%] m-auto z-0">
      <Slide className="" canSwipe={false}>
        {slideImages.map((slideImage, index) => (
          <div key={index}>
            <img
              className="flex items-center justify-center w-[100%] h-[300px] object-cover"
              src={slideImage.url}
              alt=""
            />
          </div>
        ))}
      </Slide>
    </div>
  )
}
export default SlideshowUser
