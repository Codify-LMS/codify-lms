'use client'; 

import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { HiOutlineUserCircle } from 'react-icons/hi';

import Button from "@/components/Button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
     {/* Navbar Section */}
      <nav className="relative z-10 bg-white px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between relative">
          
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/codify-black.svg"
                alt="Codify Logo"
                width={100}
                height={30}
              />
            </Link>
          </div>

          {/* Center: Nav Links */}
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex space-x-6 text-gray-700">
            <Link href="" className="font-medium hover:text-gray-900">Home</Link> 
            <Link href="#about" className="font-medium hover:text-gray-900">About us</Link>
            <Link href="#courses" className="font-medium hover:text-gray-900">Courses</Link>
            <Link href="#contact" className="font-medium hover:text-gray-900">Contact us</Link>
            <Link href="faq" className="font-medium hover:text-gray-900">FAQ&apos;s</Link>
          </div>

          {/* Right: Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/auth/login" className="flex items-center text-gray-700 font-medium hover:text-gray-900"> 
              <HiOutlineUserCircle size={24} className="mr-1" />
              Sign in
            </Link>
            <Button>
              Create free account
            </Button>
          </div>
          
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className={twMerge(
          `
          relative flex flex-col md:flex-row items-center justify-between
          min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-64px)]
          px-4 md:px-16
          text-white
          overflow-hidden
          flex-grow
          `
        )}
      >
        <div
          className="absolute inset-0 m-4 md:m-8 lg:m-10 rounded-[2.5rem] overflow-hidden"
          style={{
            background: 'linear-gradient(90deg, #7A4FD6 0%, #5C74DD 50%, #2BAEF4 100%)',
            zIndex: 0,
          }}
        ></div>
        <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left md:w-1/2 p-10">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 w-full">
            Level Up Coding Skills, Boost Your Career
          </h1>
          <p className="text-lg md:text-md mb-8 max-w-lg text-gray-200">
            Learn to code from scratch with Codify — a web-based platform that supports your journey every step of the way, no matter who you are or where you come from.
          </p>
          <div className="flex space-x-4">
            <Button>
              Get Started
            </Button>
            <Button className="border bg-white text-[#050772] hover:opacity-80 hover:border-white hover:text-codify-primary-purple">
              Learn More
            </Button>
          </div>
        </div>

        <div className="relative z-10 w-full md:w-1/2 flex justify-center items-center md:-mb-[10px] mt-8 py-10">
          <Image
            src="/hero-girl.svg" 
            alt="Learning with Codify"
            width={650}
            height={650}
            className="object-contain"
          />

           <div className="absolute top-[20%] left-[5%] md:top-1/4 md:left-2/4 bg-white/70 backdrop-blur-md rounded-lg p-3 flex items-center shadow-lg text-black"> {/* Changed bg-white/20 to bg-white/70, text-white to text-black */}
            <Image
              src="/icon-students.svg" // Pastikan path ikon Anda benar
              alt="Students Icon"
              width={24}
              height={24}
              className="mr-2"
            />
            <span className="font-bold text-lg">250k</span>
            <span className="ml-1 text-sm">Assisted Student</span>
          </div>

          <div className="absolute bottom-[20%] right-[5%] md:bottom-1/4 md:right-3/4 bg-white/70 backdrop-blur-md rounded-lg p-3 flex items-center shadow-lg text-black"> {/* Changed bg-white/20 to bg-white/70, text-white to text-black */}
            <Image
              src="/icon-courses.svg"
              alt="Courses Icon"
              width={24}
              height={24}
              className="mr-2"
            />
            <span className="font-bold text-lg">250+</span>
            <span className="ml-1 text-sm">Courses</span>
          </div>
        </div>
      </section>

      <footer className="mt-10 py-8 text-center bg-gray-100 text-gray-700">
        <p>&copy; 2025 Codify LMS. All rights reserved.</p>
      </footer>
    </div>
  );
}

