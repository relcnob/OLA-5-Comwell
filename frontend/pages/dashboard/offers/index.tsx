import DashboardWrapper from "@/components/cms/dashboardWrapper/DashboardWrapper";
import Spinner from "@/components/spinner/Spinner";
import Heading from "@/components/text/heading/Heading";
import { Offer } from "@/utils/offer.types";
import React, { useEffect } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/button/Button";
import "dotenv/config";

function Page() {
  const [offers, setOffers] = useState<Offer[]>();
  const [areOffersLoading, setAreOffersLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalState, setModalState] = useState("confirmation");
  const [modalOffer, setModalOffer] = useState<Offer>();

  useEffect(() => {
    setAreOffersLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BE_HOST}/hotel-offers`)
      .then((response) => response.json())
      .then((data: Offer[]) => {
        setOffers(data);
        setAreOffersLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function deleteOffer(id: string) {
    const options = {
      method: "DELETE",
    };
    fetch(`${process.env.NEXT_PUBLIC_BE_HOST}/hotel-offers/${id}`, options)
      .then((response) => response.json())
      .then((res) => {
        setModalState("finished");
        // remove offer from fetched offers to decrease amount of requests (refetch)
        setOffers(offers?.filter((offer) => offer._id !== id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleModal(offer: Offer) {
    setIsModalVisible(true);
    setModalState("confirmation");
    setModalOffer(offer);
  }

  return (
    <>
      <div
        className={`fixed w-full h-screen z-50 items-center justify-center bg-sea-80 bg-opacity-50 p-4 ${
          isModalVisible && modalOffer ? "flex" : "hidden"
        }`}
      >
        <div className={`flex flex-col gap-4 bg-white p-8 rounded-lg `}>
          {modalState == "confirmation" && modalOffer && (
            <>
              <Heading size={4}>Delete offer</Heading>
              <p>{`Are you sure you want to delete ${modalOffer?.name} offer?`}</p>
              <div
                className={`flex flex-row gap-2 justify-between items-center mt-4`}
              >
                <Button
                  color="outline"
                  isActive
                  isSmall
                  onClick={() => {
                    setModalOffer(undefined);
                    setIsModalVisible(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="sea"
                  isActive
                  isSmall
                  onClick={() => {
                    deleteOffer(modalOffer._id);
                  }}
                >
                  Delete offer
                </Button>
              </div>
            </>
          )}
          {modalState == "finished" && (
            <>
              <Heading size={4}>Delete offer</Heading>
              <p>{`Offer was deleted successfully.`}</p>
              <div
                className={`flex flex-row gap-2 justify-center items-center mt-4`}
              >
                <Button
                  color="outline"
                  isActive
                  isSmall
                  onClick={() => {
                    setModalOffer(undefined);
                    setIsModalVisible(false);
                  }}
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      <DashboardWrapper active="offers">
        <div className={`flex flex-row justify-between items-center mt-8`}>
          <Heading size={3} styles={`my-8`}>
            Offers
          </Heading>
          <Link
            href={"/dashboard/offers/add"}
            className={`flex flex-row py-2 px-6 rounded-full bg-sea-80 text-slate-50 hover:bg-sea-100 transition font-medium`}
          >
            Add new offer
          </Link>
        </div>
        <section
          className={`w-full bg-slate-50 rounded-lg px-2 lg:px-8 py-4 flex flex-col col-span-2`}
        >
          <section className={`flex flex-col gap-2 md:gap-4 `}>
            {!areOffersLoading && offers && offers.length === 0 ? (
              <p
                className={`p-4 flex justify-center items-center font-semibold text-charcoal-60`}
              >
                No offers found
              </p>
            ) : (
              <>
                <header
                  className={`grid grid-cols-4 xl:grid-cols-8 gap-2 py-2 font-medium text-charcoal-60`}
                >
                  <p className={`col-span-1 xl:col-span-2`}>Image</p>
                  <p
                    className={`col-span-2 md:col-span-1 lg:col-span-2 xl:col-span-3`}
                  >
                    Offer name
                  </p>
                  <p
                    className={`hidden md:flex lg:hidden xl:flex justify-center`}
                  >
                    Offer tag
                  </p>
                  <p className={`flex justify-end gap-4 xl:col-span-2 pr-4`}>
                    Options
                  </p>
                </header>
                {areOffersLoading && <Spinner />}
                {offers?.map((offer) => {
                  return (
                    <article
                      key={offer._id}
                      className={`overflow-hidden rounded border border-charcoal-40 grid grid-cols-4 xl:grid-cols-8 gap-2`}
                    >
                      <Image
                        src={offer.image}
                        alt={offer.name}
                        height={230}
                        width={200}
                        className={`object-cover max-h-20 w-full aspect-square col-span-1 xl:col-span-2`}
                      ></Image>
                      <div
                        className={`flex flex-col justify-center col-span-2 md:col-span-1 lg:col-span-2 xl:col-span-3`}
                      >
                        <Heading size={6}>{`${offer.name}`}</Heading>
                      </div>
                      <div
                        className={`hidden md:flex lg:hidden xl:flex items-center justify-center`}
                      >
                        <p
                          className={`font-sans font-medium text-trumpet-desktop text-center`}
                        >{`${offer.tag}`}</p>
                      </div>
                      <div
                        className={`flex flex-row items-center justify-end gap-4 xl:col-span-2 pr-4`}
                      >
                        <Link
                          href={`/dashboard/offers/${offer._id}`}
                          className={`flex justify-center items-center border rounded-full p-2 group hover:bg-sea-80 hover:border-sea-80 transition`}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={`transition fill-charcoal-80 group-hover:fill-slate-50`}
                          >
                            <path d="M22.5 19.5H1.5V21H22.5V19.5Z" />
                            <path d="M19.05 6.75C19.65 6.15 19.65 5.25 19.05 4.65L16.35 1.95C15.75 1.35 14.85 1.35 14.25 1.95L3 13.2V18H7.8L19.05 6.75ZM15.3 3L18 5.7L15.75 7.95L13.05 5.25L15.3 3ZM4.5 16.5V13.8L12 6.3L14.7 9L7.2 16.5H4.5Z" />
                          </svg>
                        </Link>
                        <span
                          className={`flex justify-center items-center border rounded-full p-2 group hover:bg-sea-80 hover:border-sea-80 transition cursor-pointer`}
                          onClick={() => {
                            handleModal(offer);
                          }}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={`transition fill-charcoal-80 group-hover:fill-slate-50`}
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M15 1.5H9V3H15V1.5ZM3 4.5V6H4.5V21C4.5 21.8284 5.17157 22.5 6 22.5H18C18.8284 22.5 19.5 21.8284 19.5 21V6H21V4.5H3ZM6 21V6H18V21H6ZM9 9H10.5V18H9V9ZM15 9H13.5V18H15V9Z"
                            />
                          </svg>
                        </span>
                      </div>
                    </article>
                  );
                })}
              </>
            )}
          </section>
        </section>
      </DashboardWrapper>
    </>
  );
}

export default Page;
