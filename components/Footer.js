import Image from "next/image";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full">
      <div className="w-full">
        {/* Updated Image */}
        <Image
          src="https://i.postimg.cc/T1TS5PgN/footer5.png"
          alt="Footer"
          width={1000}
          height={300}
          className="object-contain w-full h-auto"
          priority
        />
      </div>
    </footer>
  );
};

export default Footer;
