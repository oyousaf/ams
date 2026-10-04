import Link from "next/link";
import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import { FaPhone, FaEnvelope, FaArrowLeft } from "react-icons/fa";
import CarGallery from "@/components/CarGallery";
import { fetchCarsServer, fetchCarBySlug } from "@/lib/fetchCars";
import { resolveImages } from "@/lib/resolveImage";
import {
  SITE_URL,
  PHONE_E164,
  PHONE_DISPLAY,
  carPath,
  carSlug,
  detectMake,
  makeNames,
  formatPrice,
} from "@/lib/carMeta";

const absolute = (src) => (src.startsWith("http") ? src : `${SITE_URL}${src}`);

const mileageText = (mileage) =>
  mileage ? `${Number(mileage).toLocaleString("en-GB")} miles` : null;

function describe(car) {
  const facts = [
    car.year || null,
    mileageText(car.mileage),
    car.transmission,
    car.engineType,
    car.carType,
  ].filter(Boolean);

  const text = `${car.title}${car.isSold ? " (sold)" : ` for ${formatPrice(car.price)}`}${
    facts.length ? ` - ${facts.join(", ")}` : ""
  }. Inspected and prepared by Ace Motor Sales in Heckmondwike, West Yorkshire, with nationwide UK delivery.`;

  return text.length > 160 ? `${text.slice(0, 157).trimEnd()}...` : text;
}

// Pre-render current stock at build; anything added later renders on first
// request and is then cached (and refreshed via the "cars" tag).
export async function generateStaticParams() {
  const cars = await fetchCarsServer();
  return cars.map((car) => ({ slug: carSlug(car) }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { car } = await fetchCarBySlug(slug);

  if (!car) {
    return { title: "Car not found", robots: { index: false } };
  }

  const title = `${car.title}${car.year ? ` (${car.year})` : ""} for sale in Heckmondwike`;
  const description = describe(car);
  const path = carPath(car);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website" },
    twitter: { title, description },
  };
}

export default async function CarPage({ params }) {
  const { slug } = await params;
  const { car, canonical } = await fetchCarBySlug(slug);

  if (!car) notFound();
  // Title was edited since this link was shared - send to the current URL.
  if (!canonical) permanentRedirect(carPath(car));

  const images = resolveImages(car.imageUrls);
  const make = detectMake(car.title);
  const price = formatPrice(car.price);
  const url = `${SITE_URL}${carPath(car)}`;

  const otherCars = (await fetchCarsServer())
    .filter((other) => other.id !== car.id && !other.isSold)
    .slice(0, 3);

  const specs = [
    ["Year", car.year || null],
    ["Mileage", mileageText(car.mileage)],
    ["Gearbox", car.transmission],
    ["Fuel", car.engineType],
    ["Engine size", car.engineSize ? `${car.engineSize}L` : null],
    ["Body type", car.carType],
  ].filter(([, value]) => value);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Car",
        "@id": `${url}#car`,
        name: car.title,
        description: car.description,
        url,
        image: images.map(absolute),
        ...(make && { brand: { "@type": "Brand", name: makeNames[make] } }),
        ...(car.year && { vehicleModelDate: String(car.year) }),
        ...(car.mileage && {
          mileageFromOdometer: {
            "@type": "QuantitativeValue",
            value: car.mileage,
            unitCode: "SMI",
          },
        }),
        ...(car.transmission && { vehicleTransmission: car.transmission }),
        ...(car.engineType && { fuelType: car.engineType }),
        ...(car.carType && { bodyType: car.carType }),
        ...(car.engineSize && {
          vehicleEngine: {
            "@type": "EngineSpecification",
            engineDisplacement: {
              "@type": "QuantitativeValue",
              value: car.engineSize,
              unitCode: "LTR",
            },
          },
        }),
        itemCondition: "https://schema.org/UsedCondition",
        ...(car.price > 0 && {
          offers: {
            "@type": "Offer",
            url,
            price: car.price,
            priceCurrency: "GBP",
            availability: car.isSold
              ? "https://schema.org/SoldOut"
              : "https://schema.org/InStock",
            itemCondition: "https://schema.org/UsedCondition",
            seller: { "@id": `${SITE_URL}/#dealer` },
          },
        }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Cars", item: `${SITE_URL}/#cars` },
          { "@type": "ListItem", position: 3, name: car.title, item: url },
        ],
      },
    ],
  };

  const ctaBase =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-semibold transition focus-visible:outline-none focus-visible:ring-2";

  return (
    <article className="px-4 pb-8 pt-32 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto max-w-7xl">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/75">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-white hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/#cars" className="hover:text-white hover:underline">
                Cars
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-semibold text-white">
              {car.title}
            </li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <CarGallery images={images} title={car.title} isSold={car.isSold} />

          <div className="h-fit rounded-2xl bg-linear-to-br from-rose-900 via-rose-800 to-rose-950 p-6 shadow-xl sm:p-8">
            {car.isFeatured && !car.isSold && (
              <span className="mb-3 inline-block rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold uppercase text-rose-900">
                Featured
              </span>
            )}

            <h1 className="text-3xl font-extrabold uppercase tracking-tight text-rose-100 md:text-4xl">
              {car.title}
            </h1>

            <p className="mt-3 text-4xl font-bold text-white">
              {car.isSold ? (
                <span className="text-rose-200">Sold</span>
              ) : (
                price
              )}
            </p>

            {specs.length > 0 && (
              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-white/10 py-6">
                {specs.map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-rose-200/90">
                      {label}
                    </dt>
                    <dd className="mt-0.5 text-lg font-semibold text-white">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {car.isSold ? (
              <p className="mt-6 text-white/85">
                This one has found a new home. Call us and we&apos;ll help you
                find something similar.
              </p>
            ) : (
              <p className="mt-6 text-white/85">
                Reserve this car for £99 while you arrange a viewing, test drive
                or finance. Nationwide delivery available.
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <a
                href={`tel:${PHONE_E164}`}
                className={`${ctaBase} bg-white text-rose-900 hover:bg-rose-50 focus-visible:ring-rose-200`}
              >
                <FaPhone aria-hidden="true" />
                Call {PHONE_DISPLAY}
              </a>
              <a
                href="#contact"
                className={`${ctaBase} border border-white/30 text-white hover:bg-white/10 focus-visible:ring-white/60`}
              >
                <FaEnvelope aria-hidden="true" />
                Send an enquiry
              </a>
            </div>
          </div>
        </div>

        {car.description && (
          <section aria-labelledby="about-car" className="mt-14 max-w-3xl">
            <h2 id="about-car" className="text-2xl font-bold text-white">
              About this car
            </h2>
            <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-white/85">
              {car.description}
            </p>
          </section>
        )}

        {otherCars.length > 0 && (
          <section aria-labelledby="more-cars" className="mt-16">
            <h2 id="more-cars" className="text-2xl font-bold text-white">
              More cars on the forecourt
            </h2>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherCars.map((other) => (
                <li key={other.id}>
                  <Link
                    href={carPath(other)}
                    className="group block overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10 transition hover:ring-rose-400/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                  >
                    <div className="relative aspect-4/3">
                      <Image
                        src={resolveImages(other.imageUrls)[0]}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3 p-4">
                      <span className="font-semibold uppercase text-rose-100 group-hover:text-white">
                        {other.title}
                      </span>
                      <span className="shrink-0 font-bold text-white">
                        {formatPrice(other.price)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-12">
          <Link
            href="/#cars"
            className="inline-flex items-center gap-2 font-semibold text-rose-300 hover:text-rose-200"
          >
            <FaArrowLeft aria-hidden="true" />
            Back to all cars
          </Link>
        </p>
      </div>
    </article>
  );
}
