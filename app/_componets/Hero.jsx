"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import FeatureCard from "../(routes)/dashboard/_components/FeatureCard";
import Footer from "../(routes)/dashboard/_components/Footer";

const Hero = () => {
  return (
    <>
      <section className="bg-white mt-12 flex flex-col gap-15 overflow-hidden">
        <div className=" flex flex-col justify-center items-center gap-5 md:gap-2">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl tracking-[-2px]">
              Your Money,
              <strong className="text-primary tracking-wide">
                {" "}
                Simplified{" "}
              </strong>
            </h1>
            <p className="mt-4 text-sm text-pretty text-gray-700 sm:text-sm/relaxed text-center tracking-wider">
              See what's possible with a clean, simple budget and expense
              tracker.
            </p>
          </div>
          <div className="flex flex-col justify-center items-center gap-3 sm:mt-6">
            <Link href={"/sign-in"}>
              <div className="rounded-lg bg-gradient-to-r from-blue-600 via-cyan-500 to-green-600 px-7 py-3 transition transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:brightness-110 cursor-pointer select-none">
                <h1 className="font-semibold text-white text-lg md:text-xl tracking-wide">
                  GET STARTED FOR FREE
                </h1>
              </div>
            </Link>
            <p className="text-gray-500 text-sm">No credit card required</p>
          </div>
        </div>

        <div className=" flex flex-col gap-20">
          <div className="flex w-full items-center justify-center px-5">
            <div className="flex flex-col gap-4 w-full justify-center items-center">
              <p className=" text-gray-500 text-xs sm:text-sm">Demo View</p>

              <div className="flex flex-wrap px-5 w-full justify-center items-center">
                {/* MacBook Dashboard container */}
                <div className="relative z-0 max-w-[600px] w-full aspect-[750/431]">
                  <Image
                    src="/dashboard.png"
                    alt="Dashboard"
                    fill
                    className="object-contain"
                    priority
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
          <div className=" px-5 flex justify-center">
            <div className=" flex flex-col items-center max-w-[1200px] gap-5">
              <h1 className="font-medium tracking-tight text-2xl md:text-4xl text-black">
                What Expensigo Offers
              </h1>

              <FeatureCard />
            </div>
          </div>
        </div>
        <Footer className="w-full" />
      </section>
    </>
  );
};

export default Hero;
