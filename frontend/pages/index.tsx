import Header from "@/components/header/Header";
import InfoCard from "@/components/infoCard/InfoCard";
import Heading from "@/components/text/heading/Heading";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import ExperienceCard from "@/components/experienceCard/ExperienceCard";
import Label from "@/components/label/Label";
import Button from "@/components/button/Button";
import Footer from "@/components/footer/Footer";
import { Package } from "@/utils/Package.types";
import Spinner from "@/components/spinner/Spinner";
import { Offer } from "@/utils/Offer.types";

function index() {
  const [arePkgLoading, setArePkgLoading] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [areOffersLoading, setAreOffersLoading] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [sliderRef, slider] = useKeenSlider(
    {
      breakpoints: {
        "(min-width: 768px)": {
          slides: { perView: 2, spacing: 5 },
        },
        "(min-width: 1000px)": {
          slides: { perView: 3, spacing: 15 },
        },
      },
      slides: { perView: 1 },
    },
    []
  );

  useEffect(() => {
    setArePkgLoading(true);
    setAreOffersLoading(true);
    fetch("http://localhost:5000/packages")
      .then((response) => response.json())
      .then((data: Package[]) => {
        setPackages(data);
        setArePkgLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });

    fetch("http://localhost:5000/hotel-offers")
      .then((response) => response.json())
      .then((data: Offer[]) => {
        setOffers(data);
        setAreOffersLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Header />
      <main className={`max-w-screen overflow-hidden`}>
        <section
          id="hero"
          className={`w-full h-[calc(100vh-118px)] relative pt-[86px]`}
        >
          <div
            className={`w-full h-full z-20 relative max-w-2xl 2xl:max-w-[1600px] mx-auto`}
          >
            <Heading size={1} color="white">
              TEST
            </Heading>
            {/* booking form here */}
          </div>
          <Image
            src="/img/hero.jpg"
            alt="placeholder"
            height={1000}
            width={1920}
            className={
              "w-full brightness-90 contrast-[1.1] h-[calc(100vh-118px)] object-cover absolute top-0 left-0"
            }
          />
        </section>
        <section
          id=""
          className={`max-w-screen-2xl 2xl:max-w-[1600px] grid sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 py-20 px-8 mx-auto`}
        >
          {areOffersLoading && (
            <div className={`col-span-3`}>
              <Spinner />
            </div>
          )}
          {!areOffersLoading &&
            offers.length &&
            offers
              .slice(-3)
              .map((offer, index) => (
                <InfoCard
                  key={offer._id}
                  src={offer.image}
                  title={offer.name}
                  description={offer.description}
                  label={offer.tag}
                  href={`/${offer.href}`}
                  styles={`${
                    index == 0 ? `col-span-2` : `col-span-1`
                  } md:col-span-1`}
                />
              ))}
        </section>
        <section className={`py-20  relative`}>
          <div
            className={`px-8 mx-auto 2xl:max-w-[1600px] mb-8 w-full flex flex-row justify-between`}
          >
            <Heading size={3}>Offers & Experiences</Heading>
            <Button
              color="outline"
              isActive
              onClick={() => {
                console.log("whatever");
              }}
              isSmall
            >
              See our offers and experiences
            </Button>
          </div>

          <div className={`w-screen overflow-visible`}>
            {arePkgLoading && <Spinner />}
            {packages.length > 0 && !arePkgLoading && (
              <div
                ref={sliderRef}
                className={`keen-slider !overflow-visible max-w-[1600px] mx-auto px-8`}
              >
                {" "}
                {packages.map((pkg, index) => {
                  return (
                    <ExperienceCard
                      key={pkg._id}
                      linkTo={`/packages/${pkg._id}`}
                      image={pkg.image}
                      title={pkg.name}
                      description={pkg.description}
                      tag={pkg.type.toUpperCase()}
                      price={pkg.price}
                      discount={
                        pkg.discount && pkg.discount > 0 ? pkg.discount : 0
                      }
                      styles={`keen-slider__slide number-slide${index}`}
                    />
                  );
                })}{" "}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default index;