'use client';

import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { HiOutlineUserCircle, HiMenu, HiX } from 'react-icons/hi'; // Import HiMenu dan HiX untuk ikon hamburger
import { useState } from 'react'; // Import useState untuk mengelola state menu mobile

import Button from "@/components/Button"; // Pastikan path ini benar

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false); // Tutup menu mobile setelah klik
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 mx-4 bg-white relative z-50 shadow-sm md:shadow-none"> {/* Z-index tinggi agar di atas semua */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/codify-black.svg"
              alt="Codify Logo"
              width={100}
              height={30}
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center items-center space-x-6 text-gray-700">
          <button onClick={() => scrollToSection('home')} className="font-medium hover:text-gray-900 text-[#5C74DD] transition duration-200">Home</button>
          <button onClick={() => scrollToSection('features')} className="font-medium hover:text-gray-900 transition duration-200">How it Works</button>
          <button onClick={() => scrollToSection('why-choose-us')} className="font-medium hover:text-gray-900 transition duration-200">Why Choose Us</button>
          <button onClick={() => scrollToSection('reviews')} className="font-medium hover:text-gray-900 transition duration-200">Reviews</button>
          <button onClick={() => scrollToSection('contact')} className="font-medium hover:text-gray-900 transition duration-200">Contact</button>
          {/* Untuk link seperti Courses, About us, FAQ's sebaiknya mengarah ke halaman terpisah */}
          {/* <Link href="/courses" className="font-medium hover:text-gray-900">Courses</Link> */}
          {/* <Link href="/about" className="font-medium hover:text-gray-900">About us</Link> */}
          {/* <Link href="/faq" className="font-medium hover:text-gray-900">FAQ&apos;s</Link> */}
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/auth/login" className="hidden md:flex items-center text-gray-700 font-medium hover:text-gray-900 transition duration-200">
            <HiOutlineUserCircle size={24} className="mr-1" />
            Sign in
          </Link>
          <Link href="/auth/register" className="hidden md:block">
            <Button className="bg-[#28094B] text-white hover:opacity-80 transition duration-200">
              Create free account
            </Button>
          </Link>

          {/* Mobile Hamburger Icon */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-700 hover:text-gray-900 transition duration-200"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white bg-opacity-95 z-40 flex flex-col items-center justify-center space-y-6 text-xl animate-fade-in">
          <button onClick={() => scrollToSection('home')} className="font-medium text-[#5C74DD] hover:text-gray-900 transition duration-200">Home</button>
          <button onClick={() => scrollToSection('features')} className="font-medium hover:text-gray-900 transition duration-200">How it Works</button>
          <button onClick={() => scrollToSection('why-choose-us')} className="font-medium hover:text-gray-900 transition duration-200">Why Choose Us</button>
          <button onClick={() => scrollToSection('reviews')} className="font-medium hover:text-gray-900 transition duration-200">Reviews</button>
          <button onClick={() => scrollToSection('contact')} className="font-medium hover:text-gray-900 transition duration-200">Contact</button>
          <Link href="/auth/login" className="flex items-center text-gray-700 font-medium hover:text-gray-900 transition duration-200">
            <HiOutlineUserCircle size={24} className="mr-2" />
            Sign in
          </Link>
          <Link href="/auth/register">
            <Button className="bg-[#28094B] text-white hover:opacity-80 transition duration-200 px-6 py-3">
              Create free account
            </Button>
          </Link>
        </div>
      )}

      {/* Hero Section */}
      <section
        id="home" 
        className={twMerge(
          `
          relative flex flex-col md:flex-row items-center justify-between
          min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-64px)]
          px-4 md:px-16
          text-white
          overflow-hidden
          flex-grow
          py-10 md:py-0
          `
        )}
      >
        <div
          className="absolute inset-0 m-4 md:m-8 lg:m-10 rounded-[2.5rem] overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(90deg, #7A4FD6 0%, #5C74DD 50%, #2BAEF4 100%)',
            zIndex: 0,
          }}
        ></div>
        <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left md:w-1/2 p-10 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 w-full drop-shadow-lg">
            Level Up Coding Skills, Boost Your Career
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-lg text-gray-200 leading-relaxed">
            Learn to code from scratch with Codify — a web-based platform that supports your journey every step of the way, no matter who you are or where you come from.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            <Link href="/auth/register">
            <Button className="bg-white text-[#28094B] hover:bg-gray-100 px-8 py-3 rounded-full shadow-lg transition duration-300">
              Get Started
            </Button>
            </Link>
            <Link href="#features">
            <Button className="border text-white hover:bg-white hover:text-[#28094B] px-8 py-3 rounded-full shadow-lg transition duration-300">
              Learn More
            </Button>
            </Link>
          </div>
        </div>

        <div className="relative z-10 w-full md:w-1/2 flex justify-center items-center md:-mb-[10px] mt-8 py-10 animate-fade-in-up md:animate-fade-in-right">
          <Image
            src="/hero-girl.svg"
            alt="Learning with Codify"
            width={650}
            height={650}
            className="object-contain drop-shadow-2xl"
          />

          <div className="absolute top-[10%] left-[5%] md:top-1/4 md:left-2/4 bg-white/80 backdrop-blur-sm rounded-xl p-3 flex items-center shadow-xl text-black transform transition duration-300 hover:scale-105">
            <Image
              src="/icon-students.svg"
              alt="Students Icon"
              width={28}
              height={28}
              className="mr-2"
            />
            <span className="font-bold text-lg md:text-xl">250k</span>
            <span className="ml-1 text-sm md:text-base whitespace-nowrap">Assisted Student</span>
          </div>

          <div className="absolute bottom-[10%] right-[5%] md:bottom-1/4 md:right-3/4 bg-white/80 backdrop-blur-sm rounded-xl p-3 flex items-center shadow-xl text-black transform transition duration-300 hover:scale-105">
            <Image
              src="/icon-courses.svg"
              alt="Courses Icon"
              width={28}
              height={28}
              className="mr-2"
            />
            <span className="font-bold text-lg md:text-xl">250+</span>
            <span className="ml-1 text-sm md:text-base whitespace-nowrap">Courses</span>
          </div>
        </div>
      </section>

      {/* Learning Process Section */}
      <section id="features" className="bg-white py-16 px-4 md:px-16">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">Learning Process</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Learn to code through clear, structured reading materials — no overwhelming videos, just focused content.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Find Course */}
            <div
              className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center transform transition duration-500 hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              <div
                className="p-3 rounded-full mb-4"
                style={{ background: 'linear-gradient(137deg, #5FC3F2 -12.5%, #3A81A3 126.8%)' }}
              >
                <Image src="/find.svg" alt="Find Course" width={32} height={32} />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Find Course</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Find what do you want to learn by searching class name, category or instructor name's.
              </p>
            </div>

            {/* Card 2: Read & Learn */}
            <div
              className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center transform transition duration-500 hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              <div
                className="p-3 rounded-full mb-4"
                style={{ background: 'linear-gradient(137deg, #28E076 -12.5%, #0CB955 126.8%)' }}
              >
                <Image src="/read.svg" alt="Read & Learn" width={32} height={32} />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Read & Learn</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Watch all the video on the class that you already in and take note for it to gain more knowledge.
              </p>
            </div>

            {/* Card 3: Do Assignments */}
            <div
              className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center transform transition duration-500 hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              <div
                className="p-3 rounded-full mb-4"
                style={{ background: 'linear-gradient(137deg, #9B51E0 -12.5%, #581893 126.8%)' }}
              >
                <Image src="/assignment.svg" alt="Do Assignments" width={32} height={32} />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Do Assignments</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                To prove that you passed the class, try the assignments that your teacher made and get the best score.
              </p>
            </div>

            {/* Card 4: Progress Tracker */}
            <div
              className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center transform transition duration-500 hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: '0.5s' }}
            >
              <div
                className="p-3 rounded-full mb-4"
                style={{ background: 'linear-gradient(137deg, #EB5757 -12.5%, #C72929 126.8%)' }}
              >
                <Image src="/progress.svg" alt="Progress Tracker" width={32} height={32} />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Progress Tracker</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Well done! you have proved that you already understand about every subject on class and get the certificate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Section */}
      <section id="why-choose-us" className="w-full bg-white py-20 px-4 md:px-16 lg:px-32 flex flex-col md:flex-row items-center gap-16 transition-all duration-500 ease-in-out">
        <div className="md:w-1/2 transform transition duration-700 hover:scale-105 animate-fade-in-left">
          <img
            src="/whychoose.svg"
            alt="Student Thinking"
            className="rounded-xl shadow-lg w-full"
          />
        </div>

        <div className="md:w-1/2 flex flex-col gap-10">
          <h2 className="text-4xl md:text-5xl leading-tight font-extrabold text-black animate-fade-in-up">
            What will you get after
            <br />
            studying at{' '}
            <span
              className="bg-gradient-to-r from-[#7A4FD6] via-[#6B62D9] to-[#2BAEF4] bg-clip-text text-transparent"
              style={{
                fontFamily: 'Poppins',
                fontWeight: 800, // Make it extra bold
                lineHeight: '52px',
                letterSpacing: '-2px',
              }}
            >
              Codify?
            </span>
          </h2>

          <div className="space-y-8 text-[18px]">
            <div className="flex gap-5 items-start transition-opacity duration-500 hover:opacity-90 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <span className="text-[#7A4FD6] font-bold text-sm pt-1">01</span>
              <div>
                <h3 className="font-bold text-[22px] text-gray-900">Flexible Learning</h3>
                <p className="text-gray-600 text-[16px]">
                  No deadlines, Study anytime, anywhere, at your own pace.
                </p>
              </div>
            </div>

            <div className="flex gap-5 items-start transition-opacity duration-500 hover:opacity-90 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <span className="text-[#7A4FD6] font-bold text-sm pt-1">02</span> {/* Changed from 03 to 02 for sequential order */}
              <div>
                <h3 className="font-bold text-[22px] text-gray-900">Beginner-Friendly</h3> {/* Renamed from Hands-on Practice */}
                <p className="text-gray-600 text-[16px]">
                  Our courses are designed to guide you from zero to hero, step-by-step.
                </p>
              </div>
            </div>

            <div className="flex gap-5 items-start transition-opacity duration-500 hover:opacity-90 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <span className="text-[#7A4FD6] font-bold text-sm pt-1">03</span> {/* Changed from 02 to 03 for sequential order */}
              <div>
                <h3 className="font-bold text-[22px] text-gray-900">Gamified Learning</h3> {/* Renamed from Beginner-Friendly */}
                <p className="text-gray-600 text-[16px]">
                  Stay motivated with points, badges, and achievements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Review Section */}
      <section id="reviews" className="w-full py-20 px-4 flex justify-center" style={{ backgroundColor: 'rgba(122, 79, 214, 0.10)' }}>
        <div className="max-w-6xl w-full text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-[#001489] mb-12 animate-fade-in-up">
            What do students say about <span className="text-[#001489]">Codify?</span>
          </h1>

          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 mb-6 pb-6">
            <div className="flex gap-6 px-2 w-max">
              {/* --- Card 1 --- */}
              <div className="w-64 bg-white rounded-2xl shadow-lg p-6 text-center flex-shrink-0 transform transition duration-300 hover:scale-105 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
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
              <div className="w-64 bg-white rounded-2xl shadow-lg p-6 text-center flex-shrink-0 transform transition duration-300 hover:scale-105 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
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
              <div className="w-64 bg-white rounded-2xl shadow-lg p-6 text-center flex-shrink-0 transform transition duration-300 hover:scale-105 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
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
              <div className="w-64 bg-white rounded-2xl shadow-lg p-6 text-center flex-shrink-0 transform transition duration-300 hover:scale-105 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
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
              <div className="w-64 bg-white rounded-2xl shadow-lg p-6 text-center flex-shrink-0 transform transition duration-300 hover:scale-105 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
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
              <div className="w-64 bg-white rounded-2xl shadow-lg p-6 text-center flex-shrink-0 transform transition duration-300 hover:scale-105 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                <div
                  className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden"
                  style={{
                    background: 'linear-gradient(180deg, #2B2F7F 0%, #5D2E9B 44.71%, #1D2E5E 100%)',
                    padding: '4px',
                  }}
                >
                  <img src="/reviewer6.svg" alt="Nadia" className="w-full h-full object-cover rounded-full bg-white" /> {/* Typo fixed: reviewer 6.svg to reviewer6.svg */}
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

      {/* Subscribe Section */}
      <section id="contact" className="py-16 px-8 mt-0 bg-white">
        <div className="max-w-8xl mx-auto bg-[#1B0058] rounded-2xl py-20 px-8 md:px-16 text-center shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in-up">
            Do you still have any questions?
          </h2>
          <p className="text-sm text-white font-normal mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Don&apos;t hesitate to leave us your phone number. We will contact you to
            discuss any questions you may have
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center bg-white rounded-md overflow-hidden shadow-lg max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <input
              type="tel"
              placeholder="Enter your phone number"
              className="flex-1 px-4 py-3 text-sm outline-none placeholder-gray-700 text-gray-800 focus:ring-2 focus:ring-[#5C74DD]"
              aria-label="Phone number"
            />
            <button className="px-6 py-3 bg-[#E4D8FE] text-[#1B0058] font-medium hover:bg-[#d8c4fc] transition duration-200 w-full sm:w-auto">
              Submit
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f1f1fc] text-[#1d1d1f] px-6 pt-16 pb-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo dan Kontak */}
          <div className="animate-fade-in-up">
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
                <p>codifylmscode@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Kategori */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="font-semibold mb-3 text-lg">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-gray-900 transition duration-200 cursor-pointer">Counseling</li>
              <li className="hover:text-gray-900 transition duration-200 cursor-pointer">Health and fitness</li>
              <li className="hover:text-gray-900 transition duration-200 cursor-pointer">Individual development</li>
              <li className="hover:text-gray-900 transition duration-200 cursor-pointer">more</li>
            </ul>
          </div>

          {/* Links */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="font-semibold mb-3 text-lg">Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-gray-900 transition duration-200">About us</Link></li> {/* Changed to /about page */}
              <li><Link href="/blog" className="hover:text-gray-900 transition duration-200">Blog</Link></li> {/* Changed to /blog page */}
            </ul>
          </div>

          {/* Subscription */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="font-semibold mb-3 text-lg">Stay up to date with the latest courses</h3>
            <div className="flex mt-4 rounded-lg overflow-hidden shadow-md">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 p-2 outline-none placeholder-gray-500 text-gray-800 text-sm focus:ring-2 focus:ring-[#5C74DD]"
                aria-label="Email for newsletter"
              />
              <button className="bg-[#030169] text-white px-5 py-2 text-sm font-medium hover:bg-[#020140] transition duration-200">
                Send
              </button>
            </div>
          </div>
        </div>
        <div className="mt-16 text-center text-gray-700 text-sm border-t border-gray-300 pt-4">
          <p>&copy; {new Date().getFullYear()} Codify LMS. All rights reserved.</p>
        </div>
      </footer>

      {/* Global Animations - tambahkan atau sesuaikan di globals.css jika ingin lebih terstruktur */}
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

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes fadeInRight {
          0% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInLeft {
          0% {
            opacity: 0;
            transform: translateX(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeUp 0.8s ease-out forwards;
          opacity: 0; /* Pastikan elemen tersembunyi sebelum animasi */
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-right {
          animation: fadeInRight 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}