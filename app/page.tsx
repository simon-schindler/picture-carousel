import { PictureCarousel } from "./components/pictureCarousel";

export default function Home() {

  const pictures=[
    {src: '/picture-carousel/dott.svg', alt: 'Black dott'},
    {src: '/picture-carousel/rect.svg', alt: 'Black rect'},
    {src: '/picture-carousel/triangle.svg', alt: 'Black triangle'}
  ]

  return (
    <section>
      <PictureCarousel pictures={pictures}/>
    </section>
  );
}
