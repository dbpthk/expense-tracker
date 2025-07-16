import React from "react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <div>
      <section className="bg-white lg:grid lg:h-screen lg:place-content-center">
        <div className="mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-prose text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Your Money,
              <strong className="text-primary tracking-wide">
                {" "}
                Simplified{" "}
              </strong>
            </h1>

            <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
              Track, analyze, and improve your spending habits with confidence.
            </p>

            <div className="mt-4 flex justify-center gap-4 sm:mt-6">
              <Link href={"/sign-in"}>
                <div className="inline-block rounded border border-primary bg-primary px-10 py-3 font-medium text-white shadow-sm transition-colors hover:bg-green-800 cursor-pointer">
                  Get Started
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-center px-5">
          <Image
            className=" rounded-xl border-2"
            src={"/dashboard.png"}
            alt="dashboard"
            width={1000}
            height={700}
          />
        </div>
      </section>
    </div>
  );
};

export default Hero;
