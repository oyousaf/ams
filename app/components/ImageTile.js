import Image from 'next/image';

const ImageTile = ({ src, alt }) => {
  return (
    <div className="relative w-full h-[300px] md:h-[400px]">
      <Image
        src={src}
        alt={alt}
        layout="fill"
        objectFit="cover"
        className="rounded-lg"
      />
    </div>
  );
};

export default ImageTile;
