"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import FeatureCard from "../(routes)/dashboard/_components/FeatureCard";

const Hero = () => {
  return (
    <>
      <section className="bg-white px-5 mt-12 flex flex-col gap-15">
        <div className=" flex flex-col justify-center items-center gap-5 md:gap-2">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl tracking-[-2px]">
              Your Money,
              <strong className="text-primary tracking-wide">
                {" "}
                Simplified{" "}
              </strong>
            </h1>
            <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed text-center tracking-wider">
              See what's possible with a clean, simple expense tracker.
            </p>
          </div>
          <div className="flex justify-center gap-4 sm:mt-6">
            <Link href={"/sign-in"}>
              <div className="rounded-full border-none bg-[#009ffc] px-7 py-[10px] font-medium  text-white text-xl shadow-xl tracking-wide transition-all duration-300 ease-linear hover:bg-[#0089ff] hover:scale-[1.05] cursor-pointer">
                GET STARTED FOR FREE
              </div>
            </Link>
          </div>
        </div>

        <div className=" flex flex-col gap-15">
          <div className="flex w-full items-center justify-center px-5">
            <div className="flex flex-col gap-2">
              <p className="text-gray-700 pl-1 text-sm">Demo View</p>
              {/* desktop  */}
              <Image
                className=" rounded-xl border-2 hidden md:block drop-shadow-xl"
                src={"/dashboard.png"}
                alt="dashboard"
                width={1200}
                height={900}
                quality={100}
                priority
              />
              {/* mobile  */}
              <Image
                className="block md:hidden rounded-xl border-2 drop-shadow-xl"
                src={"/mDashboard.jpg"}
                alt="dashboard"
                width={300}
                height={900}
                quality={100}
                priority
              />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="mb-20 flex flex-col lg:flex-row lg:justify-between lg:items-center max-w-[1200px]">
              <h1 className="font-medium tracking-wide text-2xl lg:text-3xl text-[#009ffc] mb-6">
                What Expensigo Offers
              </h1>

              <FeatureCard />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
