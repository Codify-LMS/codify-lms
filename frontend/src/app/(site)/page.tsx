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
      
      {/* Learning Process Section */}
      <section className="bg-white py-16 px-4 md:px-16">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Learning Process</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Learn to code through clear, structured reading materials — no overwhelming videos, just focused content.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Find Course */}
            <div
              className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center transform transition duration-500 hover:scale-105 opacity-0 animate-fade-up"
              style={{ animationDelay: '0.1s', animation: 'fadeUp 0.8s ease-out forwards' }}
            >
              <div
                className="p-3 rounded-full mb-4"
                style={{ background: 'linear-gradient(137deg, #5FC3F2 -12.5%, #3A81A3 126.8%)' }}
              >
                <Image src="/find.svg" alt="Find Course" width={32} height={32} />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Find Course</h3>
              <p className="text-gray-600 text-sm">
                Find what do you want to learn by searching class name, category or instructor name's.
              </p>
            </div>

            {/* Card 2: Read & Learn */}
            <div
              className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center transform transition duration-500 hover:scale-105 opacity-0 animate-fade-up"
              style={{ animationDelay: '0.2s', animation: 'fadeUp 0.8s ease-out forwards' }}
            >
              <div
                className="p-3 rounded-full mb-4"
                style={{ background: 'linear-gradient(137deg, #28E076 -12.5%, #0CB955 126.8%)' }}
              >
                <Image src="/read.svg" alt="Read & Learn" width={32} height={32} />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Read & Learn</h3>
              <p className="text-gray-600 text-sm">
                Watch all the video on the class that you already in and take note for it to gain more knowledge.
              </p>
            </div>

            {/* Card 3: Do Assignments */}
            <div
              className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center transform transition duration-500 hover:scale-105 opacity-0 animate-fade-up"
              style={{ animationDelay: '0.3s', animation: 'fadeUp 0.8s ease-out forwards' }}
            >
              <div
                className="p-3 rounded-full mb-4"
                style={{ background: 'linear-gradient(137deg, #9B51E0 -12.5%, #581893 126.8%)' }}
              >
                <Image src="/assignment.svg" alt="Do Assignments" width={32} height={32} />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Do Assignments</h3>
              <p className="text-gray-600 text-sm">
                To prove that you passed the class, try the assignments that your teacher made and get the best score.
              </p>
            </div>

            {/* Card 4: Progress Tracker */}
            <div
              className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center transform transition duration-500 hover:scale-105 opacity-0 animate-fade-up"
              style={{ animationDelay: '0.4s', animation: 'fadeUp 0.8s ease-out forwards' }}
            >
              <div
                className="p-3 rounded-full mb-4"
                style={{ background: 'linear-gradient(137deg, #EB5757 -12.5%, #C72929 126.8%)' }}
              >
                <Image src="/progress.svg" alt="Progress Tracker" width={32} height={32} />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Progress Tracker</h3>
              <p className="text-gray-600 text-sm">
                Well done! you have proved that you already understand about every subject on class and get the certificate.
              </p>
            </div>
          </div>
        </div>

        {/* Tambahin ini buat animasinya */}
        <style jsx>{`
          @keyframes fadeUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-up {
            animation: fadeUp 0.8s ease-out forwards;
          }
        `}</style>
      </section>
      
    {/* Value Section */}
    <section className="w-full bg-white py-20 px-4 md:px-16 lg:px-32 flex flex-col md:flex-row items-center gap-16 transition-all duration-500 ease-in-out">
      <div className="md:w-1/2 transform transition duration-700 hover:scale-105">
        <img
          src="/whychoose.svg"
          alt="Student Thinking"
          className="rounded-xl shadow-lg w-full"
        />
      </div>

      <div className="md:w-1/2 flex flex-col gap-10 animate-fade-in-up">
        <h2 className="text-[52px] md:text-[52px] leading-tight font-bold text-black">
          What will you get after
          <br />
          studying at{' '}
          <span
            className="bg-gradient-to-r from-[#7A4FD6] via-[#6B62D9] to-[#2BAEF4] bg-clip-text text-transparent"
            style={{
              fontFamily: 'Poppins',
              fontWeight: 700,
              lineHeight: '52px',
              letterSpacing: '-2px',
            }}
          >
            Codify?
          </span>
        </h2>

        <div className="space-y-8 text-[18px]">
          <div className="flex gap-5 items-start transition-opacity duration-500 hover:opacity-90">
            <span className="text-[#7A4FD6] font-bold text-sm pt-1">01</span>
            <div>
              <h3 className="font-bold text-[22px] text-gray-900">Flexible Learning</h3>
              <p className="text-gray-600 text-[16px]">
                No deadlines, Study anytime, anywhere, at your own pace.
              </p>
            </div>
          </div>

          <div className="flex gap-5 items-start transition-opacity duration-500 hover:opacity-90">
            <span className="text-[#7A4FD6] font-bold text-sm pt-1">03</span>
            <div>
              <h3 className="font-bold text-[22px] text-gray-900">Hands-on Practice</h3>
              <p className="text-gray-600 text-[16px]">
                We only choose experienced instructors for courses
              </p>
            </div>
          </div>

          <div className="flex gap-5 items-start transition-opacity duration-500 hover:opacity-90">
            <span className="text-[#7A4FD6] font-bold text-sm pt-1">02</span>
            <div>
              <h3 className="font-bold text-[22px] text-gray-900">Beginner-Friendly</h3>
              <p className="text-gray-600 text-[16px]">
                Stay motivated with points, badges, and achievements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Review Section */}
    <section className="w-full py-20 px-4 flex justify-center" style={{ backgroundColor: 'rgba(122, 79, 214, 0.10)' }}>
      <div className="max-w-6xl w-full text-center">
        <h1 className="text-2xl md:text-4xl font-bold text-[#001489] mb-12">
          What do students say about <span className="text-[#001489]">Codify?</span>
        </h1>

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 mb-6 pb-6">
          <div className="flex gap-6 px-2 w-max">
            {/* --- Card 1 --- */}
            <div className="w-64 bg-white rounded-2xl shadow-lg p-6 text-center flex-shrink-0">
              <div
                className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, #2B2F7F 0%, #5D2E9B 44.71%, #1D2E5E 100%)',
                  padding: '4px',
                }}
              >
                <img src="/reviewer1.svg" alt="Lisa" className="w-full h-full object-cover rounded-full bg-white" />
              </div>
              <h3 className="font-semibold text-base text-black">Lisa</h3>
              <p className="text-xs text-gray-500 mb-2">SMP Negeri 12 Bandung</p>
              <p className="text-sm text-gray-700">
                Codify helped me love coding! Amazing platform.
              </p>
            </div>

            {/* --- Card 2 --- */}
            <div className="w-64 bg-white rounded-2xl shadow-lg p-6 text-center flex-shrink-0">
              <div
                className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, #2B2F7F 0%, #5D2E9B 44.71%, #1D2E5E 100%)',
                  padding: '4px',
                }}
              >
                <img src="/reviewer2.svg" alt="Ricky" className="w-full h-full object-cover rounded-full bg-white" />
              </div>
              <h3 className="font-semibold text-base text-black">Ricky</h3>
              <p className="text-xs text-gray-500 mb-2">SD Negeri 3 Surabaya</p>
              <p className="text-sm text-gray-700">
                I learned so much and had fun. Thank you Codify!
              </p>
            </div>

            {/* --- Card 3 --- */}
            <div className="w-64 bg-white rounded-2xl shadow-lg p-6 text-center flex-shrink-0">
              <div
                className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, #2B2F7F 0%, #5D2E9B 44.71%, #1D2E5E 100%)',
                  padding: '4px',
                }}
              >
                <img src="/reviewer3.svg" alt="Jessica Andrew" className="w-full h-full object-cover rounded-full bg-white" />
              </div>
              <h3 className="font-semibold text-base text-black">Jessica Andrew</h3>
              <p className="text-xs text-gray-500 mb-2">SMA Negeri 11 Bekasi</p>
              <p className="text-sm text-gray-700">
                My child has improved a lot after school. Thank you very much Codify!
              </p>
            </div>

            {/* --- Card 4 --- */}
            <div className="w-64 bg-white rounded-2xl shadow-lg p-6 text-center flex-shrink-0">
              <div
                className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, #2B2F7F 0%, #5D2E9B 44.71%, #1D2E5E 100%)',
                  padding: '4px',
                }}
              >
                <img src="/reviewer4.svg" alt="Averielle Zee" className="w-full h-full object-cover rounded-full bg-white" />
              </div>
              <h3 className="font-semibold text-base text-black">Averielle Zee</h3>
              <p className="text-xs text-gray-500 mb-2">SMP Negeri 30 Pontianak</p>
              <p className="text-sm text-gray-700">
                The mentor was very supportive and the courses are structured well.
              </p>
            </div>

            {/* --- Card 5 --- */}
            <div className="w-64 bg-white rounded-2xl shadow-lg p-6 text-center flex-shrink-0">
              <div
                className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, #2B2F7F 0%, #5D2E9B 44.71%, #1D2E5E 100%)',
                  padding: '4px',
                }}
              >
                <img src="/reviewer5.svg" alt="Michael" className="w-full h-full object-cover rounded-full bg-white" />
              </div>
              <h3 className="font-semibold text-base text-black">Michael</h3>
              <p className="text-xs text-gray-500 mb-2">SMP Negeri 4 Jakarta</p>
              <p className="text-sm text-gray-700">
                Great experience with Codify! Learned lots of new skills.
              </p>
            </div>

            {/* --- Card 6 --- */}
            <div className="w-64 bg-white rounded-2xl shadow-lg p-6 text-center flex-shrink-0">
              <div
                className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, #2B2F7F 0%, #5D2E9B 44.71%, #1D2E5E 100%)',
                  padding: '4px',
                }}
              >
                <img src="/reviewer 6.svg" alt="Nadia" className="w-full h-full object-cover rounded-full bg-white" />
              </div>
              <h3 className="font-semibold text-base text-black">Nadia</h3>
              <p className="text-xs text-gray-500 mb-2">SMA Negeri 5 Malang</p>
              <p className="text-sm text-gray-700">
                The platform is user-friendly and very helpful!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* subscribe Section */}
    <section className="py-16 px-8 mt-0 bg-white">
      <div className="max-w-8xl mx-auto bg-[#1B0058] rounded-2xl py-20 px-8 md:px-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Do you still have any questions?
        </h2>
        <p className="text-sm text-white font-normal mb-10">
          Don&apos;t hesitate to leave us your phone number. We will contact you to
          discuss any questions you may have
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center bg-white rounded-md overflow-hidden shadow-md max-w-xl mx-auto">
          <input
            type="tel"
            placeholder="Enter your phone number"
            className="flex-1 px-4 py-3 text-sm outline-none placeholder-gray-700 text-gray-800"
          />
          <button className="px-6 py-3 bg-[#E4D8FE] text-[#1B0058] font hover:bg-[#d8c4fc] transition">
            Submit
          </button>
        </div>
      </div>
    </section>

     <footer className="bg-[#f1f1fc] text-[#1d1d1f] px-6 pt-16 pb-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo dan Kontak */}
        <div>
          <Image src="/codifyremovebg.svg" alt="Codify Logo" width={100} height={40} />
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Image src="/location.svg" alt="Address" width={16} height={16} />
              <p>Kenanga Street number 17 Cibubur</p>
            </div>
            <div className="flex items-center gap-2">
              <Image src="/call.svg" alt="Phone" width={16} height={16} />
              <p>+9229341037</p>
            </div>
            <div className="flex items-center gap-2">
              <Image src="/Time.svg" alt="Hours" width={16} height={16} />
              <p>Response hours: 8 to 20</p>
            </div>
            <div className="flex items-center gap-2">
              <Image src="/message.svg" alt="Email" width={16} height={16} />
              <p>codify@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Kategori */}
        <div>
          <h3 className="font-semibold mb-3">Categories</h3>
          <ul className="space-y-2 text-sm">
            <li>Counseling</li>
            <li>Health and fitness</li>
            <li>Individual development</li>
            <li>more</li>
          </ul>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold mb-3">Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#">About us</Link></li>
            <li><Link href="#">blog</Link></li>
          </ul>
        </div>

        {/* Subscription */}
        <div>
          <h3 className="font-semibold mb-3">Stay up to date with the latest courses</h3>
          <div className="flex mt-4">
            <input
              type="email"
              placeholder="Email"
              className="rounded-l-lg p-2 w-full border border-gray-300 text-sm"
            />
            <button className="bg-[#030169] text-white px-5 rounded-r-lg text-sm font-medium">
              Send
            </button>
          </div>
        </div>
      </div>
      <div className="mt-16 text-center bg-[#f1f1fc] text-gray-700">
        <p>&copy; 2025 Codify LMS. All rights reserved.</p>
      </div>
      </footer>
    </div>
  );
}

